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

  it("evicts the oldest tracked IP once the store hits its cap", () => {
    const start = Date.now();

    // Saturate ip-0 so it would stay blocked if its bucket survived.
    for (let i = 0; i < 10; i++) checkRateLimit("ip-0", start);
    expect(checkRateLimit("ip-0", start).allowed).toBe(false);

    // Fill the store to its 5000-entry cap (ip-0 already counts as
    // one), then add one more: the oldest bucket (ip-0, inserted
    // first) must be evicted to make room for the new key.
    for (let i = 1; i < 5000; i++) checkRateLimit(`ip-${i}`, start);
    checkRateLimit("ip-5000", start);

    // If ip-0 had not been evicted it would still be blocked; instead
    // it is treated as a fresh visitor.
    expect(checkRateLimit("ip-0", start).allowed).toBe(true);
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
