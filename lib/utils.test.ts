import { describe, expect, it, vi } from "vitest";

import { cn, encodeImportPath, formatRelativeTime } from "./utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

describe("encodeImportPath", () => {
  it("percent-encodes each path segment independently", () => {
    expect(encodeImportPath("github.com/a b/c+d")).toBe(
      "github.com/a%20b/c%2Bd",
    );
  });

  it("leaves an already-safe path untouched", () => {
    expect(encodeImportPath("github.com/gin-gonic/gin")).toBe(
      "github.com/gin-gonic/gin",
    );
  });
});

describe("formatRelativeTime", () => {
  it("returns an empty string for an unknown placeholder", () => {
    expect(formatRelativeTime("Unknown")).toBe("");
    expect(formatRelativeTime("N/A")).toBe("");
    expect(formatRelativeTime("")).toBe("");
  });

  it("returns an empty string for an unparsable date", () => {
    expect(formatRelativeTime("not-a-date")).toBe("");
  });

  it("formats a date from years ago", () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 2);
    expect(formatRelativeTime(date.toISOString())).toBe("2y ago");
  });

  it("formats a date from days ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-10T00:00:00Z"));

    expect(formatRelativeTime("2024-06-05T00:00:00Z")).toBe("5d ago");

    vi.useRealTimers();
  });

  it("formats a very recent date as just now", () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe("just now");
  });
});
