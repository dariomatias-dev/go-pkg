import { cacheLife } from "next/cache";

import { ApiErrors, ok } from "@/lib/api/response";
import { packageVersionsQuerySchema, parseQuery } from "@/lib/api/schemas";
import {
  escapeGoModule,
  GO_PROXY_BASE,
  resilientFetch,
} from "@/lib/github/client";
import { logger } from "@/lib/logger";

async function getVersions(importPath: string): Promise<string[]> {
  "use cache";
  cacheLife({ revalidate: 3600 });

  const escaped = escapeGoModule(importPath);
  const res = await resilientFetch(`${GO_PROXY_BASE}/${escaped}/@v/list`);

  if (!res.ok) return [];
  return (await res.text()).split("\n").filter(Boolean).reverse();
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  const url = new URL(request.url);
  const parsed = parseQuery(packageVersionsQuerySchema, url.searchParams);

  if (!parsed.success) {
    return ApiErrors.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid request.",
    );
  }

  const { importPath, page, perPage } = parsed.data;

  try {
    const all = await getVersions(importPath);
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * perPage;
    const versions = all.slice(offset, offset + perPage);

    return ok(
      { versions, total, page: safePage, totalPages },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    logger.error("Failed to fetch package versions", {
      route: "package-versions",
      durationMs: Date.now() - startedAt,
      status: 500,
      errorName: error instanceof Error ? error.name : "unknown",
    });

    return ApiErrors.internal("Failed to fetch versions.");
  }
}
