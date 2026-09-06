import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearPackageHistory,
  loadPackageHistory,
  removeFromPackageHistory,
  saveToPackageHistory,
  subscribePackageHistory,
} from "./package-history";

beforeEach(() => {
  localStorage.clear();
});

describe("saveToPackageHistory / loadPackageHistory", () => {
  it("adds the most recent package to the front", () => {
    saveToPackageHistory("github.com/a/a");
    saveToPackageHistory("github.com/b/b");

    expect(loadPackageHistory()).toEqual(["github.com/b/b", "github.com/a/a"]);
  });

  it("deduplicates by moving an existing entry to the front", () => {
    saveToPackageHistory("github.com/a/a");
    saveToPackageHistory("github.com/b/b");
    saveToPackageHistory("github.com/a/a");

    expect(loadPackageHistory()).toEqual(["github.com/a/a", "github.com/b/b"]);
  });

  it("caps history at 5 items", () => {
    for (let i = 0; i < 7; i++) saveToPackageHistory(`github.com/p/${i}`);

    expect(loadPackageHistory()).toHaveLength(5);
    expect(loadPackageHistory()[0]).toBe("github.com/p/6");
  });

  it("ignores blank import paths", () => {
    saveToPackageHistory("   ");
    expect(loadPackageHistory()).toEqual([]);
  });
});

describe("removeFromPackageHistory", () => {
  it("removes only the matching entry", () => {
    saveToPackageHistory("github.com/a/a");
    saveToPackageHistory("github.com/b/b");

    removeFromPackageHistory("github.com/a/a");

    expect(loadPackageHistory()).toEqual(["github.com/b/b"]);
  });
});

describe("clearPackageHistory", () => {
  it("empties the history", () => {
    saveToPackageHistory("github.com/a/a");
    clearPackageHistory();

    expect(loadPackageHistory()).toEqual([]);
  });
});

describe("subscribePackageHistory", () => {
  it("notifies subscribers when the history changes", () => {
    const callback = vi.fn();
    const unsubscribe = subscribePackageHistory(callback);

    saveToPackageHistory("github.com/a/a");
    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();
    saveToPackageHistory("github.com/b/b");
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
