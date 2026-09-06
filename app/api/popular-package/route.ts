import { cacheLife } from "next/cache";

import { ApiErrors, ok } from "@/lib/api/response";
import { parseQuery, popularPackageQuerySchema } from "@/lib/api/schemas";
import { CURATED_CATEGORIES } from "@/lib/curated-categories";
import { fetchPopularPackages } from "@/lib/github";
import { logger } from "@/lib/logger";

async function getCachedPopularPackages(page: number, perPage: number) {
  "use cache";

  cacheLife({ revalidate: 3600 });

  const { packages, total } = await fetchPopularPackages(page, perPage);
  const uniqueTags = Array.from(
    new Set(packages.flatMap((pkg) => pkg.tags)),
  ).slice(0, 18);

  return { packages, total, uniqueTags };
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  const { searchParams } = new URL(request.url);
  const parsed = parseQuery(popularPackageQuerySchema, searchParams);

  if (!parsed.success) {
    return ApiErrors.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid request.",
    );
  }

  const { page, perPage } = parsed.data;

  try {
    const { packages, total, uniqueTags } = await getCachedPopularPackages(
      page,
      perPage,
    );

    return ok(
      {
        packages,
        categories: CURATED_CATEGORIES,
        popularTags: uniqueTags,
        page,
        perPage,
        total,
        hasMore: page * perPage < total,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    logger.error("Failed to load popular packages", {
      route: "popular-package",
      durationMs: Date.now() - startedAt,
      status: 500,
      errorName: error instanceof Error ? error.name : "unknown",
    });

    return ApiErrors.internal("Failed to load popular packages.");
  }
}
