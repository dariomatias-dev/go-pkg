import { describe, expect, it } from "vitest";

import { buildSearchQuery, guessCategory, normalizePackage } from "./normalize";
import type { GitHubRepo } from "./types";

describe("guessCategory", () => {
  it("detects database packages", () => {
    expect(guessCategory("gorm", "an orm for go")).toBe("database");
  });

  it("detects cli packages", () => {
    expect(guessCategory("cobra", "a cli library")).toBe("cli");
  });

  it("detects logging packages", () => {
    expect(guessCategory("zap", "structured logging library")).toBe("logging");
  });

  it("detects testing packages", () => {
    expect(guessCategory("testify", "mocking and assertions")).toBe("testing");
  });

  it("detects web packages", () => {
    expect(guessCategory("gin", "http web framework")).toBe("web");
  });

  it("falls back to utilities when nothing matches", () => {
    expect(guessCategory("lo", "generic go helpers")).toBe("utilities");
  });
});

describe("buildSearchQuery", () => {
  it("always includes the language:go filter", () => {
    expect(buildSearchQuery("", "", "")).toBe("language:go");
  });

  it("appends the free-text query", () => {
    expect(buildSearchQuery("router", "", "")).toBe("language:go router");
  });

  it("maps a known category to its OR-expression", () => {
    expect(buildSearchQuery("", "web", "")).toBe(
      "language:go (web OR http OR api OR grpc OR router OR framework)",
    );
  });

  it("passes through an unknown category verbatim", () => {
    expect(buildSearchQuery("", "graphics", "")).toBe("language:go graphics");
  });

  it("appends the tag", () => {
    expect(buildSearchQuery("", "", "orm")).toBe("language:go orm");
  });
});

function makeRepo(overrides: Partial<GitHubRepo> = {}): GitHubRepo {
  return {
    full_name: "gin-gonic/gin",
    name: "gin",
    description: "Gin web framework",
    stargazers_count: 100,
    forks_count: 10,
    license: { spdx_id: "MIT", name: "MIT License" },
    topics: ["web", "http", "framework", "router", "api", "extra"],
    owner: { login: "gin-gonic" },
    html_url: "https://github.com/gin-gonic/gin",
    updated_at: "2024-05-01T00:00:00Z",
    pushed_at: "2024-05-01T00:00:00Z",
    ...overrides,
  };
}

describe("normalizePackage", () => {
  it("maps a full GitHub repo response onto a GoPackage", () => {
    const pkg = normalizePackage(makeRepo());

    expect(pkg).toMatchObject({
      name: "gin",
      importPath: "github.com/gin-gonic/gin",
      description: "Gin web framework",
      stars: 100,
      forks: 10,
      license: "MIT",
      author: "gin-gonic",
      githubUrl: "https://github.com/gin-gonic/gin",
      publishedAt: "2024-05-01",
    });
    expect(pkg.tags).toEqual([
      "gin",
      "web",
      "http",
      "framework",
      "router",
      "api",
    ]);
  });

  it("falls back to defaults when fields are missing", () => {
    const pkg = normalizePackage(
      makeRepo({
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        license: null,
        topics: [],
        owner: null,
        updated_at: null,
      }),
    );

    expect(pkg.description).toBe("No description available.");
    expect(pkg.stars).toBe(0);
    expect(pkg.license).toBe("Unknown");
    expect(pkg.author).toBe("unknown");
    expect(pkg.publishedAt).toBe("Unknown");
  });

  it("uses the license name when there is no license object at all", () => {
    const pkg = normalizePackage(makeRepo({ license: null }));

    expect(pkg.license).toBe("Unknown");
  });

  it("uses the explicit category over the guessed one", () => {
    const pkg = normalizePackage(makeRepo(), "database");
    expect(pkg.category).toBe("database");
  });
});
