import type { Page } from "@playwright/test";

import type { GoPackage } from "@/types";

import { SAMPLE_PACKAGES, toPopularPackage } from "./packages";

export async function mockPopularPackages(page: Page) {
  await page.route("**/api/popular-package**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        packages: SAMPLE_PACKAGES.map(toPopularPackage),
        total: SAMPLE_PACKAGES.length,
      }),
    }),
  );
}

export async function mockSearch(
  page: Page,
  results: GoPackage[] = SAMPLE_PACKAGES,
) {
  await page.route("**/api/search**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        results,
        totalResults: results.length,
        page: 1,
        perPage: 10,
        hasMore: false,
      }),
    }),
  );
}

export async function mockPackageInfo(
  page: Page,
  packages: GoPackage[] = SAMPLE_PACKAGES,
) {
  await page.route("**/api/package-info**", (route) => {
    const url = new URL(route.request().url());
    const importPath = url.searchParams.get("importPath");
    const pkg = packages.find((p) => p.importPath === importPath);

    if (!pkg) return route.fulfill({ status: 404 });

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ pkg, goMod: "", isCustom: false }),
    });
  });
}
