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

  it("returns 500 when the GitHub API rejects the request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    const res = await GET(req("q=gin"));

    expect(res.status).toBe(500);
  });

  // Today an out-of-range sort/order value is cast without validation
  // and forwarded straight to the GitHub API (see lib/github/search.ts
  // and plan.md Etapa 5, which adds a zod schema here). This test
  // documents that gap: it is expected to fail loudly instead of
  // rejecting the request with a 400.
  it("forwards an invalid sort value instead of rejecting it (pre-Etapa-5 baseline)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(searchResponse());

    const res = await GET(req("q=gin&sort=not-a-real-sort"));

    expect(res.status).toBe(200);
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain("sort=not-a-real-sort");
  });
});
