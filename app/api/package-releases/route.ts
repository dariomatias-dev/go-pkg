import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";

import {
  GITHUB_BASE_URL,
  getGithubHeaders,
  parseGithubRepo,
} from "@/lib/github/client";
import type { GitHubRelease } from "@/lib/github/types";

async function getCachedReleases(
  owner: string,
  repo: string,
  page: number,
  perPage: number,
): Promise<{ releases: GitHubRelease[]; hasNextPage: boolean }> {
  "use cache";

  cacheLife({ revalidate: 3600 });

  const res = await fetch(
    `${GITHUB_BASE_URL}/repos/${owner}/${repo}/releases?per_page=${perPage}&page=${page}`,
    { headers: getGithubHeaders() },
  );

  if (!res.ok) return { releases: [], hasNextPage: false };

  const releases = (await res.json()) as GitHubRelease[];
  const linkHeader = res.headers.get("Link") ?? "";
  const hasNextPage = linkHeader.includes('rel="next"');

  return { releases, hasNextPage };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const importPath = url.searchParams.get("importPath");
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const perPage = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("perPage") ?? "30")),
  );

  if (!importPath) {
    return NextResponse.json({ error: "Missing importPath" }, { status: 400 });
  }

  const repoInfo = parseGithubRepo(importPath);

  if (!repoInfo) {
    return NextResponse.json({ releases: [], hasNextPage: false });
  }

  try {
    const result = await getCachedReleases(
      repoInfo.owner,
      repoInfo.repo,
      page,
      perPage,
    );

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 500 },
    );
  }
}
