import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

function req(params: string) {
  return new Request(`http://localhost/api/package-info?${params}`);
}

function mockFetchByUrl(handlers: Record<string, () => Response>) {
  return vi.fn((input: RequestInfo | URL) => {
    const url = String(input);

    for (const [pattern, handler] of Object.entries(handlers)) {
      if (url.includes(pattern)) return Promise.resolve(handler());
    }

    return Promise.resolve(new Response(null, { status: 404 }));
  });
}

describe("GET /api/package-info", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("400s when importPath is missing", async () => {
    const res = await GET(req(""));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe("bad_request");
    expect(body.error.message).toMatch(/required/i);
  });

  it("400s when importPath fails validation", async () => {
    const res = await GET(req("importPath=" + encodeURIComponent("; rm -rf")));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.message).toMatch(/invalid/i);
  });

  it("returns the assembled package detail for a valid importPath", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("v1.0.0\nv1.1.0\n"),
        "@v/v1.1.0.mod": () => new Response("require github.com/a/b v1.0.0\n"),
        "api.github.com/repos": () =>
          new Response(
            JSON.stringify({
              stargazers_count: 42,
              forks_count: 7,
              license: { spdx_id: "MIT", name: "MIT License" },
              description: "A great package",
              updated_at: "2024-05-01T00:00:00Z",
            }),
          ),
        "raw.githubusercontent.com": () => new Response("# hello"),
      }),
    );

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.pkg.latestVersion).toBe("v1.1.0");
    expect(body.pkg.stars).toBe(42);
    expect(res.headers.get("Cache-Control")).toMatch(/s-maxage=1800/);
  });

  it("returns 500 when the upstream fetch keeps failing", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });

  it("returns 500 when a non-Error value is thrown", async () => {
    vi.mocked(fetch).mockRejectedValue("boom");

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });
});
