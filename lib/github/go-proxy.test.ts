import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  countGoModDependencies,
  enrichWithGoProxy,
  fetchGoMod,
} from "./go-proxy";

describe("countGoModDependencies", () => {
  it("counts single-line require statements", () => {
    const goMod = [
      "module example.com/foo",
      "",
      "require github.com/a/b v1.0.0",
      "require github.com/c/d v2.0.0",
    ].join("\n");

    expect(countGoModDependencies(goMod)).toBe(2);
  });

  it("counts entries inside a require ( ) block", () => {
    const goMod = [
      "module example.com/foo",
      "",
      "require (",
      "\tgithub.com/a/b v1.0.0",
      "\tgithub.com/c/d v2.0.0",
      ")",
    ].join("\n");

    expect(countGoModDependencies(goMod)).toBe(2);
  });

  it("ignores comment lines inside a require block", () => {
    const goMod = [
      "require (",
      "\t// indirect",
      "\tgithub.com/a/b v1.0.0",
      ")",
    ].join("\n");

    expect(countGoModDependencies(goMod)).toBe(1);
  });

  it("returns 0 for an empty go.mod", () => {
    expect(countGoModDependencies("")).toBe(0);
  });
});

describe("fetchGoMod", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the go.mod text on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("module example.com/foo\n"),
    );

    expect(await fetchGoMod("github.com/a/b", "v1.0.0")).toBe(
      "module example.com/foo\n",
    );
  });

  it("returns an empty string when the proxy responds with an error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 404 }));

    expect(await fetchGoMod("github.com/a/b", "v1.0.0")).toBe("");
  });
});

describe("enrichWithGoProxy", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the latest version and dependency count on success", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ Version: "v1.2.3" })),
      )
      .mockResolvedValueOnce(new Response("require github.com/a/b v1.0.0\n"));

    const result = await enrichWithGoProxy("github.com/a/b");

    expect(result).toEqual({ latestVersion: "v1.2.3", dependenciesCount: 1 });
  });

  it("returns empty defaults when the proxy call fails", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network error"));

    expect(await enrichWithGoProxy("github.com/a/b")).toEqual({
      latestVersion: "",
      dependenciesCount: 0,
    });
  });

  it("returns empty defaults when there is no version", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({})));

    expect(await enrichWithGoProxy("github.com/a/b")).toEqual({
      latestVersion: "",
      dependenciesCount: 0,
    });
  });
});
