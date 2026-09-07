import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearHistory,
  loadHistory,
  removeFromHistory,
  saveToHistory,
} from "./search-history";

beforeEach(() => {
  localStorage.clear();
});

describe("saveToHistory / loadHistory", () => {
  it("adds the most recent query to the front", () => {
    saveToHistory("gin");
    saveToHistory("echo");

    expect(loadHistory()).toEqual(["echo", "gin"]);
  });

  it("deduplicates case-insensitively and trims whitespace", () => {
    saveToHistory("Gin");
    saveToHistory("  gin  ");

    expect(loadHistory()).toEqual(["gin"]);
  });

  it("caps history at 5 items", () => {
    for (let i = 0; i < 7; i++) saveToHistory(`query-${i}`);

    expect(loadHistory()).toHaveLength(5);
    expect(loadHistory()[0]).toBe("query-6");
  });

  it("ignores blank queries", () => {
    saveToHistory("   ");
    expect(loadHistory()).toEqual([]);
  });
});

describe("removeFromHistory", () => {
  it("removes only the matching entry and returns the updated list", () => {
    saveToHistory("gin");
    saveToHistory("echo");

    expect(removeFromHistory("gin")).toEqual(["echo"]);
    expect(loadHistory()).toEqual(["echo"]);
  });
});

describe("clearHistory", () => {
  it("empties the history", () => {
    saveToHistory("gin");
    clearHistory();

    expect(loadHistory()).toEqual([]);
  });
});

describe("error handling", () => {
  it("loadHistory returns an empty array when stored JSON is corrupt", () => {
    localStorage.setItem("gopkg_search_history", "not valid json");

    expect(loadHistory()).toEqual([]);
  });

  it("saveToHistory silently ignores a storage failure", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

    expect(() => saveToHistory("gin")).not.toThrow();

    spy.mockRestore();
  });

  it("removeFromHistory returns an empty array on a storage failure", () => {
    saveToHistory("gin");

    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

    expect(removeFromHistory("gin")).toEqual([]);

    spy.mockRestore();
  });
});
