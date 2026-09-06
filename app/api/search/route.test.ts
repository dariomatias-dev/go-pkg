import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

function req(params: string) {
  return new Request(`http://localhost/api/search?${params}`);
}

function searchResponse() {
  return new Response(
    JSON.stringify({
      total_count: 1,
      items: [
        {
          full_name: "gin-gonic/gin",
          name: "gin",
          description: "Gin web framework",
          stargazers_count: 100,
          forks_count: 10,
          license: { spdx_id: "MIT", name: "MIT License" },
          topics: ["web"],
          owner: { login: "gin-gonic" },
          html_url: "https://github.com/gin-gonic/gin",
          updated_at: "2024-05-01T00:00:00Z",
          pushed_at: "2024-05-01T00:00:00Z",
        },
      ],
    }),
  );
}

describe("GET /api/search", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns normalized results for a valid query", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(searchResponse());

    const res = await GET(req("q=gin"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toHaveLength(1);
  });

  it("returns 500 when the GitHub API keeps rejecting the request", async () => {
    // resilientFetch retries 5xx responses, so every attempt needs a
    // response or the mock underflows.
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));

    const res = await GET(req("q=gin"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });

  it("falls back to the default sort/order instead of forwarding an invalid value", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(searchResponse());

    const res = await GET(req("q=gin&sort=not-a-real-sort&order=sideways"));

    expect(res.status).toBe(200);

    const requestedUrl = String(vi.mocked(fetch).mock.calls[0][0]);
    expect(requestedUrl).toContain("sort=stars");
    expect(requestedUrl).toContain("order=desc");
    expect(requestedUrl).not.toContain("not-a-real-sort");
  });
});
