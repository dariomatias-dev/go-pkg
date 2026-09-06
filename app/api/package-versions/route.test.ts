import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

function req(params: string) {
  return new Request(`http://localhost/api/package-versions?${params}`);
}

describe("GET /api/package-versions", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("400s when importPath is missing", async () => {
    const res = await GET(req(""));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/missing/i);
  });

  it("400s when importPath fails validation", async () => {
    const res = await GET(req("importPath=" + encodeURIComponent("; rm -rf")));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/invalid/i);
  });

  it("paginates the version list from the Go proxy", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("v1.0.0\nv1.1.0\nv1.2.0\n"),
    );

    const res = await GET(
      req("importPath=github.com/gin-gonic/gin&page=1&perPage=2"),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.versions).toEqual(["v1.2.0", "v1.1.0"]);
    expect(body.total).toBe(3);
    expect(body.totalPages).toBe(2);
  });

  it("returns 500 when the upstream fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network error"));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));

    expect(res.status).toBe(500);
  });
});
