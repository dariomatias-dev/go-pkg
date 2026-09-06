import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchPopularPackages, searchGithubPackages } from "./search";
import type { GitHubSearchResponse } from "./types";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const searchResponse: GitHubSearchResponse = {
  total_count: 1,
  items: [
    {
      full_name: "gin-gonic/gin",
      name: "gin",
      description: "Gin web framework",
      stargazers_count: 100,
      forks_count: 10,
      license: { spdx_id: "MIT", name: "MIT License" },
      topics: ["web"],
      owner: { login: "gin-gonic" },
      html_url: "https://github.com/gin-gonic/gin",
      updated_at: "2024-05-01T00:00:00Z",
      pushed_at: "2024-05-01T00:00:00Z",
    },
  ],
};

describe("searchGithubPackages", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("normalizes results and computes pagination", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(searchResponse));

    const result = await searchGithubPackages("gin", "", "", 1, 10);

    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe("gin");
    expect(result.totalResults).toBe(1);
    expect(result.hasMore).toBe(false);
  });

  it("throws a descriptive error when the GitHub API responds with an error", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));

    await expect(searchGithubPackages("gin")).rejects.toThrow(
      /GitHub API error/,
    );
  });

  it("treats a missing items array as no results", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ total_count: 0 } as unknown as GitHubSearchResponse),
    );

    const result = await searchGithubPackages("nothing");

    expect(result.results).toEqual([]);
    expect(result.totalResults).toBe(0);
  });
});

describe("fetchPopularPackages", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("enriches results with go proxy data", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(searchResponse))
      .mockResolvedValueOnce(new Response(null, { status: 404 }));

    const result = await fetchPopularPackages(1, 10);

    expect(result.total).toBe(1);
    expect(result.packages).toHaveLength(1);
    expect(result.packages[0].importPath).toBe("github.com/gin-gonic/gin");
  });

  it("throws a descriptive error when the GitHub API responds with an error", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));

    await expect(fetchPopularPackages()).rejects.toThrow(/GitHub API error/);
  });
});
