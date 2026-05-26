import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import {
  GITHUB_BASE_URL,
  getGithubHeaders,
  parseGithubRepo,
} from "@/lib/github/client";
import type { GitHubRelease } from "@/lib/github/types";

const getCachedReleases = unstable_cache(
  async (owner: string, repo: string): Promise<GitHubRelease[]> => {
    const res = await fetch(
      `${GITHUB_BASE_URL}/repos/${owner}/${repo}/releases?per_page=30`,
      { headers: getGithubHeaders() },
    );

    if (!res.ok) return [];

    return res.json() as Promise<GitHubRelease[]>;
  },
  ["package-releases"],
  { revalidate: 3600 },
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const importPath = url.searchParams.get("importPath");

  if (!importPath) {
    return NextResponse.json({ error: "Missing importPath" }, { status: 400 });
  }

  const repoInfo = parseGithubRepo(importPath);

  if (!repoInfo) {
    return NextResponse.json({ releases: [] });
  }

  try {
    const releases = await getCachedReleases(repoInfo.owner, repoInfo.repo);

    return NextResponse.json(
      { releases },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 500 },
    );
  }
}
