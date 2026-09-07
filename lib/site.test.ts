import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("SITE_URL", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it("falls back to localhost when unset", async () => {
    vi.resetModules();
    const { SITE_URL } = await import("./site");

    expect(SITE_URL.toString()).toBe("http://localhost:3000/");
  });

  it("uses NEXT_PUBLIC_SITE_URL when set", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://go-pkg-dev.vercel.app";
    vi.resetModules();
    const { SITE_URL } = await import("./site");

    expect(SITE_URL.toString()).toBe("https://go-pkg-dev.vercel.app/");
  });
});
