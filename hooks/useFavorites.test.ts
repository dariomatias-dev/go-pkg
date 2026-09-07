import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import type { GoPackage } from "@/types";

import { useFavorites } from "./useFavorites";

beforeEach(() => {
  localStorage.clear();
});

function makePackage(overrides: Partial<GoPackage> = {}): GoPackage {
  return {
    name: "gin",
    importPath: "github.com/gin-gonic/gin",
    description: "Gin web framework",
    stars: 100,
    forks: 10,
    license: "MIT",
    latestVersion: "v1.10.0",
    category: "web",
    tags: ["gin"],
    author: "gin-gonic",
    publishedAt: "2024-05-01",
    ...overrides,
  };
}

describe("useFavorites", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([]);
  });

  it("adds a favorite and reflects it in isFavorite", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.addFavorite(makePackage()));

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isFavorite("github.com/gin-gonic/gin")).toBe(true);
  });

  it("does not add the same package twice", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.addFavorite(makePackage()));
    act(() => result.current.addFavorite(makePackage()));

    expect(result.current.favorites).toHaveLength(1);
  });

  it("removes a favorite", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.addFavorite(makePackage()));
    act(() => result.current.removeFavorite("github.com/gin-gonic/gin"));

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite("github.com/gin-gonic/gin")).toBe(false);
  });

  it("toggles a favorite on and off", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.toggleFavorite(makePackage()));
    expect(result.current.isFavorite("github.com/gin-gonic/gin")).toBe(true);

    act(() => result.current.toggleFavorite(makePackage()));
    expect(result.current.isFavorite("github.com/gin-gonic/gin")).toBe(false);
  });

  it("keeps two hook instances in sync via the shared store", () => {
    const a = renderHook(() => useFavorites());
    const b = renderHook(() => useFavorites());

    act(() => a.result.current.addFavorite(makePackage()));

    expect(b.result.current.favorites).toHaveLength(1);
  });

  it("falls back to an empty list when the stored favorites are corrupt", () => {
    localStorage.setItem("gopkg_favorites", "not valid json");

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
  });

  it("only keeps githubUrl and dependenciesCount when present on the source package", () => {
    const { result } = renderHook(() => useFavorites());

    act(() =>
      result.current.addFavorite(
        makePackage({ githubUrl: undefined, dependenciesCount: 5 }),
      ),
    );

    const stored = JSON.parse(localStorage.getItem("gopkg_favorites")!);

    expect(stored[0].githubUrl).toBeUndefined();
    expect(stored[0].dependenciesCount).toBe(5);
  });
});
