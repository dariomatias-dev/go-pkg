import { cacheLife } from "next/cache";

import {
  checkRateLimit,
  getClientIp,
  READ_ROUTE_MAX_REQUESTS,
} from "@/lib/api/rate-limit";
import { ApiErrors, ok } from "@/lib/api/response";
import { parseQuery, searchQuerySchema } from "@/lib/api/schemas";
import type { SearchOrder, SearchSort } from "@/lib/github";
import { searchGithubPackages } from "@/lib/github";
import { GithubApiError } from "@/lib/github/client";
import { logger } from "@/lib/logger";

async function getCachedSearch(
  query: string,
  category: string,
  tag: string,
  page: number,
  perPage: number,
  sort: SearchSort,
  order: SearchOrder,
) {
  "use cache";

  cacheLife({ revalidate: 300 });

  return searchGithubPackages(query, category, tag, page, perPage, sort, order);
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  const rateLimit = checkRateLimit(
    `search:${getClientIp(request)}`,
    Date.now(),
    READ_ROUTE_MAX_REQUESTS,
  );

  if (!rateLimit.allowed) {
    return ApiErrors.rateLimited(
      "Too many requests. Please try again later.",
      rateLimit.retryAfterSeconds,
    );
  }

  const url = new URL(request.url);
  const parsed = parseQuery(searchQuerySchema, url.searchParams);

  if (!parsed.success) {
    return ApiErrors.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid request.",
    );
  }

  const { q, category, tag, page, perPage, sort, order } = parsed.data;

  try {
    const data = await getCachedSearch(
      q,
      category,
      tag,
      page,
      perPage,
      sort,
      order,
    );

    return ok(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    const isRateLimited =
      error instanceof GithubApiError && error.isRateLimited;

    logger.error("Failed to execute package search", {
      route: "search",
      durationMs: Date.now() - startedAt,
      status: isRateLimited ? 503 : 500,
      errorName: error instanceof Error ? error.name : "unknown",
    });

    if (isRateLimited) {
      return ApiErrors.serviceUnavailable((error as GithubApiError).message);
    }

    return ApiErrors.internal("Failed to execute package search.");
  }
}
