import { beforeEach, describe, expect, it } from "vitest";

import { checkRateLimit, getClientIp, resetRateLimitStore } from "./rate-limit";

beforeEach(() => {
  resetRateLimitStore();
});

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit("ip-a").allowed).toBe(true);
    }
  });

  it("blocks the 11th request within the same window", () => {
    for (let i = 0; i < 10; i++) checkRateLimit("ip-b");

    const result = checkRateLimit("ip-b");

    expect(result.allowed).toBe(false);
    expect(result.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    for (let i = 0; i < 10; i++) checkRateLimit("ip-c");

    expect(checkRateLimit("ip-c").allowed).toBe(false);
    expect(checkRateLimit("ip-d").allowed).toBe(true);
  });

  it("resets the count once the window has elapsed", () => {
    const start = Date.now();

    for (let i = 0; i < 10; i++) checkRateLimit("ip-e", start);

    expect(checkRateLimit("ip-e", start).allowed).toBe(false);
    expect(checkRateLimit("ip-e", start + 61_000).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("reads the first entry of x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });

    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "9.9.9.9" },
    });

    expect(getClientIp(req)).toBe("9.9.9.9");
  });

  it("falls back to 'unknown' when neither header is present", () => {
    const req = new Request("http://localhost");

    expect(getClientIp(req)).toBe("unknown");
  });
});
