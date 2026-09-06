import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { logger } from "./logger";

describe("logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("emits a JSON line with level, message and fields", () => {
    logger.error("Something broke", { route: "search", status: 500 });

    expect(console.error).toHaveBeenCalledTimes(1);

    const line = vi.mocked(console.error).mock.calls[0][0] as string;
    const entry = JSON.parse(line);

    expect(entry).toMatchObject({
      level: "error",
      message: "Something broke",
      route: "search",
      status: 500,
    });
    expect(typeof entry.time).toBe("string");
  });

  it("routes info and warn to their own console methods", () => {
    logger.info("info msg", { route: "x" });
    logger.warn("warn msg", { route: "x" });

    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).not.toHaveBeenCalled();
  });
});
