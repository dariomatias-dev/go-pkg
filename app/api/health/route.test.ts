import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

describe("GET /api/health", () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();

    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  });

  it("returns 200 and status ok when every dependency is up", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.mocked(fetch).mockResolvedValue(new Response("ok"));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.checks.github.status).toBe("up");
    expect(body.checks.goProxy.status).toBe("up");
    expect(body.checks.gemini).toEqual({ status: "up", configured: true });
  });

  it("returns 503 and status degraded when GitHub is down", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) =>
      String(input).includes("api.github.com")
        ? Promise.resolve(new Response(null, { status: 500 }))
        : Promise.resolve(new Response("ok")),
    );

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.status).toBe("degraded");
    expect(body.checks.github.status).toBe("down");
    expect(body.checks.goProxy.status).toBe("up");
  });

  it("reports gemini as down (unconfigured) without making a network call", async () => {
    delete process.env.GEMINI_API_KEY;
    vi.mocked(fetch).mockResolvedValue(new Response("ok"));

    const res = await GET();
    const body = await res.json();

    expect(body.checks.gemini).toEqual({
      status: "down",
      configured: false,
      detail: "GEMINI_API_KEY not set",
    });
    // Only github + goProxy make network calls; gemini is a config check.
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("reports a dependency down with an 'unknown error' detail for a non-Error throw", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) =>
      String(input).includes("api.github.com")
        ? Promise.reject("boom")
        : Promise.resolve(new Response("ok")),
    );

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.checks.github).toMatchObject({
      status: "down",
      detail: "unknown error",
    });
  });

  it("never caches the response", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.mocked(fetch).mockResolvedValue(new Response("ok"));

    const res = await GET();

    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});
