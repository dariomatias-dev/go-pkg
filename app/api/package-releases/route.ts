import { cacheLife } from "next/cache";

import { ApiErrors, ok } from "@/lib/api/response";
import { packageReleasesQuerySchema, parseQuery } from "@/lib/api/schemas";
import {
  getGithubHeaders,
  GITHUB_BASE_URL,
  parseGithubRepo,
  resilientFetch,
} from "@/lib/github/client";
import type { GitHubRelease } from "@/lib/github/types";
import { logger } from "@/lib/logger";

async function getCachedReleases(
  owner: string,
  repo: string,
  page: number,
  perPage: number,
): Promise<{ releases: GitHubRelease[]; hasNextPage: boolean }> {
  "use cache";

  cacheLife({ revalidate: 3600 });

  const res = await resilientFetch(
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
  const startedAt = Date.now();
  const url = new URL(request.url);
  const parsed = parseQuery(packageReleasesQuerySchema, url.searchParams);

  if (!parsed.success) {
    return ApiErrors.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid request.",
    );
  }

  const { importPath, page, perPage } = parsed.data;
  const repoInfo = parseGithubRepo(importPath);

  if (!repoInfo) {
    return ok({ releases: [], hasNextPage: false });
  }

  try {
    const result = await getCachedReleases(
      repoInfo.owner,
      repoInfo.repo,
      page,
      perPage,
    );

    return ok(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    logger.error("Failed to fetch releases", {
      route: "package-releases",
      durationMs: Date.now() - startedAt,
      status: 500,
      errorName: error instanceof Error ? error.name : "unknown",
    });

    return ApiErrors.internal("Failed to fetch releases.");
  }
}
