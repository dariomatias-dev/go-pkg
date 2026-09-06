import { cacheLife } from "next/cache";

import { ApiErrors, ok } from "@/lib/api/response";
import { packageInfoQuerySchema, parseQuery } from "@/lib/api/schemas";
import { getPackageDetail } from "@/lib/github";
import { logger } from "@/lib/logger";

async function getCachedPackageDetail(importPath: string) {
  "use cache";

  cacheLife({ revalidate: 1800 });

  return getPackageDetail(importPath);
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  const url = new URL(request.url);
  const parsed = parseQuery(packageInfoQuerySchema, url.searchParams);

  if (!parsed.success) {
    return ApiErrors.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid request.",
    );
  }

  try {
    const data = await getCachedPackageDetail(parsed.data.importPath);

    return ok(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    logger.error("Failed to load package details", {
      route: "package-info",
      durationMs: Date.now() - startedAt,
      status: 500,
      errorName: error instanceof Error ? error.name : "unknown",
    });

    return ApiErrors.internal("Unable to load package details.");
  }
}
