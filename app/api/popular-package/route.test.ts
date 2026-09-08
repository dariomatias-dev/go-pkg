import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimitStore } from "@/lib/api/rate-limit";

import { GET } from "./route";

function req(params: string, headers?: HeadersInit) {
  return new Request(`http://localhost/api/popular-package?${params}`, {
    headers,
  });
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

describe("GET /api/popular-package", () => {
  beforeEach(() => {
    resetRateLimitStore();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns packages, curated categories and popular tags", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const res = await GET(req("page=1&perPage=10"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.packages).toHaveLength(1);
    expect(body.categories).toBeInstanceOf(Array);
    expect(body.categories.length).toBeGreaterThan(0);
    expect(body.popularTags).toContain("web");
    expect(res.headers.get("Cache-Control")).toMatch(/s-maxage=3600/);
  });

  it("falls back to defaults for invalid pagination params", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const res = await GET(req("page=abc&perPage=9999"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.page).toBe(1);
  });

  it("returns 503 when GitHub rate-limits the request", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(null, { status: 403, headers: { "Retry-After": "1" } }),
    );

    const res = await GET(req("page=1&perPage=10"));
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error.code).toBe("service_unavailable");
  });

  it("returns 500 when the upstream fetch keeps failing", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));

    const res = await GET(req("page=1&perPage=10"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });

  it("returns 500 when a non-Error value is thrown", async () => {
    vi.mocked(fetch).mockRejectedValue("boom");

    const res = await GET(req("page=1&perPage=10"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });

  it("rate limits after too many requests from the same IP", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const ip = "198.51.100.7";
    const withIp = (params: string) => req(params, { "x-forwarded-for": ip });

    let lastStatus = 200;

    for (let i = 0; i < 200; i++) {
      const res = await GET(withIp("page=1&perPage=10"));

      lastStatus = res.status;
      if (lastStatus === 429) {
        const body = await res.json();

        expect(res.headers.get("Retry-After")).toBeTruthy();
        expect(body.error.code).toBe("rate_limited");
        break;
      }
    }

    expect(lastStatus).toBe(429);
  });
});
