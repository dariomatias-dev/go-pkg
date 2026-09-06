import { describe, expect, it } from "vitest";

import { ApiErrors, fail, ok } from "./response";

describe("ok", () => {
  it("returns a 200 JSON response with the given data", async () => {
    const res = ok({ hello: "world" });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ hello: "world" });
  });

  it("forwards extra init options like headers", async () => {
    const res = ok({ a: 1 }, { headers: { "Cache-Control": "no-store" } });

    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});

describe("fail", () => {
  it("wraps the error in a { error: { code, message } } envelope", async () => {
    const res = fail(400, "bad_request", "Nope.");

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "bad_request", message: "Nope." },
    });
  });
});

describe("ApiErrors", () => {
  it("badRequest returns 400", () => {
    expect(ApiErrors.badRequest("x").status).toBe(400);
  });

  it("notFound returns 404", () => {
    expect(ApiErrors.notFound("x").status).toBe(404);
  });

  it("unprocessable returns 422", () => {
    expect(ApiErrors.unprocessable("x").status).toBe(422);
  });

  it("rateLimited returns 429 with a Retry-After header when given seconds", () => {
    const res = ApiErrors.rateLimited("Slow down.", 30);

    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("30");
  });

  it("rateLimited omits Retry-After when no seconds are given", () => {
    const res = ApiErrors.rateLimited("Slow down.");

    expect(res.headers.get("Retry-After")).toBeNull();
  });

  it("serviceUnavailable returns 503", () => {
    expect(ApiErrors.serviceUnavailable("x").status).toBe(503);
  });

  it("internal returns 500", () => {
    expect(ApiErrors.internal("x").status).toBe(500);
  });
});
