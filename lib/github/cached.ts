import { cacheLife } from "next/cache";

import { getPackageDetail } from "./detail";

/**
 * Shared cache entry for package detail lookups. "use cache" keys by the
 * function's identity, so importing this single wrapper from both the
 * package-info API route and the package detail page (for its JSON-LD)
 * means a visit only pays for the GitHub/Go proxy/README fetch once
 * instead of once per call site.
 */
export async function getCachedPackageDetail(importPath: string) {
  "use cache";

  cacheLife({ revalidate: 1800 });

  return getPackageDetail(importPath);
}
