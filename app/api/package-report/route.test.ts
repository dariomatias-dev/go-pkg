import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

function req(params: string) {
  return new Request(`http://localhost/api/package-report?${params}`);
}

function badgeSvg(grade: string) {
  return `<svg><text>${grade}</text></svg>`;
}

describe("GET /api/package-report", () => {
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
  });

  it("422s when the importPath is not a GitHub package", async () => {
    const res = await GET(req("importPath=singleword"));
    const body = await res.json();

    expect(res.status).toBe(422);
    expect(body.error.code).toBe("unprocessable");
  });

  it("returns the grade and report URL for a valid repo", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(badgeSvg("A+")));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.grade).toBe("A+");
    expect(body.reportUrl).toBe(
      "https://goreportcard.com/report/github.com/gin-gonic/gin",
    );
    expect(res.headers.get("Cache-Control")).toMatch(/s-maxage=86400/);
  });

  it("404s when the badge has no recognizable grade", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(badgeSvg("Z")));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error.code).toBe("not_found");
  });

  it("404s when the badge fetch fails", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));

    expect(res.status).toBe(404);
  });

  it("returns 500 when the upstream fetch keeps failing", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });
});
