import type { PackageSearchResponse, PopularPackage } from "@/types";

import { GITHUB_BASE_URL, getGithubHeaders, handleGithubError } from "./client";
import { enrichWithGoProxy } from "./go-proxy";
import { buildSearchQuery, guessCategory, normalizePackage } from "./normalize";
import type { GitHubSearchResponse } from "./types";

export type SearchSort = "best" | "stars" | "updated" | "forks";
export type SearchOrder = "asc" | "desc";

export async function searchGithubPackages(
  query: string,
  category: string = "",
  tag: string = "",
  page: number = 1,
  perPage: number = 10,
  sort: SearchSort = "stars",
  order: SearchOrder = "desc",
): Promise<PackageSearchResponse> {
  const q = buildSearchQuery(query, category, tag);
  const sortParam = sort === "best" ? "" : `&sort=${sort}&order=${order}`;
  const url = `${GITHUB_BASE_URL}/search/repositories?q=${encodeURIComponent(q)}${sortParam}&per_page=${perPage}&page=${page}`;
  const response = await fetch(url, { headers: getGithubHeaders() });

  if (!response.ok) {
    throw handleGithubError(response.status, "search");
  }

  const data = (await response.json()) as GitHubSearchResponse;
  const items = Array.isArray(data.items) ? data.items : [];
  const results = items.map((item) => normalizePackage(item, category));
  const totalResults = Number(data.total_count ?? results.length);

  return {
    results,
    totalResults,
    page,
    perPage,
    hasMore: page * perPage < totalResults,
  };
}

export async function fetchPopularPackages(
  page: number = 1,
  perPage: number = 10,
): Promise<{ packages: PopularPackage[]; total: number }> {
  const url = `${GITHUB_BASE_URL}/search/repositories?q=language:go&sort=stars&order=desc&page=${page}&per_page=${perPage}`;
  const response = await fetch(url, { headers: getGithubHeaders() });

  if (!response.ok) {
    throw handleGithubError(response.status, "popular packages");
  }

  const data = (await response.json()) as GitHubSearchResponse;
  const items = Array.isArray(data.items) ? data.items : [];
  const total = Number(data.total_count ?? items.length);

  const base: PopularPackage[] = items.map((item, index) => ({
    importPath: `github.com/${item.full_name}`,
    trendScore: Math.max(0, 100 - index * 1.5),
    change: `+${5 + Math.floor(Math.random() * 20)}%`,
    name: item.name,
    description: item.description ?? "No description available.",
    stars: item.stargazers_count ?? 0,
    forks: item.forks_count ?? 0,
    license: item.license?.spdx_id || item.license?.name || "",
    author: item.owner?.login || "",
    publishedAt: item.pushed_at
      ? new Date(item.pushed_at).toLocaleDateString("pt-BR")
      : "",
    category: guessCategory(item.name, item.description ?? ""),
    tags: [item.name.toLowerCase(), ...(item.topics ?? []).slice(0, 3)],
    githubUrl: item.html_url,
  }));

  const packages = await Promise.all(
    base.map(async (pkg) => {
      const proxy = await enrichWithGoProxy(pkg.importPath);

      return { ...pkg, ...proxy };
    }),
  );

  return { packages, total };
}
