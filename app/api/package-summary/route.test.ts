import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimitStore } from "@/lib/api/rate-limit";

import { GET } from "./route";

const generateContent = vi.fn();

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(function GoogleGenAI() {
    return { models: { generateContent } };
  }),
}));

function req(params: string) {
  return new Request(`http://localhost/api/package-summary?${params}`);
}

describe("GET /api/package-summary", () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    resetRateLimitStore();
    generateContent.mockReset();
    process.env.GEMINI_API_KEY = "test-key";
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  });

  it("400s when importPath is missing", async () => {
    const res = await GET(req(""));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe("bad_request");
  });

  it("503s when GEMINI_API_KEY is not configured", async () => {
    delete process.env.GEMINI_API_KEY;

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));

    expect(res.status).toBe(503);
  });

  it("returns the generated summary", async () => {
    generateContent.mockResolvedValueOnce({ text: "A great package." });

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.summary).toBe("A great package.");
  });

  it("maps a quota error to 429", async () => {
    generateContent.mockRejectedValueOnce(new Error("RESOURCE_EXHAUSTED"));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(429);
    expect(body.error.code).toBe("rate_limited");
  });

  it("maps a 503/UNAVAILABLE error to service_unavailable", async () => {
    generateContent.mockRejectedValueOnce(new Error("503 UNAVAILABLE"));

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error.code).toBe("service_unavailable");
  });

  it("maps an unknown error to internal_error", async () => {
    generateContent.mockRejectedValueOnce("boom");

    const res = await GET(req("importPath=github.com/gin-gonic/gin"));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });

  it("rate limits after 10 requests from the same IP", async () => {
    generateContent.mockResolvedValue({ text: "ok" });

    const ip = "203.0.113.5";
    const withIp = (params: string) =>
      new Request(`http://localhost/api/package-summary?${params}`, {
        headers: { "x-forwarded-for": ip },
      });

    for (let i = 0; i < 10; i++) {
      const res = await GET(withIp("importPath=github.com/gin-gonic/gin"));
      expect(res.status).toBe(200);
    }

    const blocked = await GET(withIp("importPath=github.com/gin-gonic/gin"));
    const body = await blocked.json();

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    expect(body.error.code).toBe("rate_limited");
  });
});
