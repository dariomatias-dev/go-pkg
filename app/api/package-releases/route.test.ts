import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

function req(params: string) {
  return new Request(`http://localhost/api/package-releases?${params}`);
}

function releasesResponse(headers?: HeadersInit) {
  return new Response(
    JSON.stringify([
      {
        tag_name: "v1.1.0",
        name: "v1.1.0",
        published_at: "2024-05-01T00:00:00Z",
      },
    ]),
    { headers },
  );
}

describe("GET /api/package-releases", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an empty result without calling GitHub when the import path has no owner/repo segments", async () => {
    const res = await GET(req("importPath=singleword"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ releases: [], hasNextPage: false });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns paginated releases for a valid GitHub repo", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      releasesResponse({ Link: '<...>; rel="next"' }),
    );

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.releases).toHaveLength(1);
    expect(body.hasNextPage).toBe(true);
  });

  it("returns an empty result when the repo has no releases (404)", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ releases: [], hasNextPage: false });
  });

  it("returns 500 when the GitHub API keeps rejecting the request", async () => {
    // resilientFetch retries 5xx responses, so every attempt needs a
    // response or the mock underflows.
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });

  it("returns 503 with the specific message when GitHub rate-limits the request", async () => {
    const originalToken = process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_TOKEN;

    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 403 }));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error.code).toBe("service_unavailable");
    expect(body.error.message).toMatch(/rate limit exceeded/i);

    if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = originalToken;
  });

  it("returns 500 when a non-Error value is thrown", async () => {
    vi.mocked(fetch).mockRejectedValue("boom");

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });
});
