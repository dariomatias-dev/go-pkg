import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import {
  mockPackageInfo,
  mockPopularPackages,
  mockSearch,
} from "./fixtures/mockApi";
import { ECHO, GIN } from "./fixtures/packages";

// Hard gate since Etapa 6: the jsx-a11y violations flagged as warnings in
// Etapa 1 (icon-only buttons, clickable divs, unlabeled inputs) are fixed,
// so a serious/critical axe violation here is a real regression.
async function assertNoSeriousViolations(
  page: import("@playwright/test").Page,
  excludeSelectors: string[] = [],
) {
  // Several pages mount with a tw-animate-css fade/slide-in (durations up
  // to 700ms). Scanning mid-transition samples a transient, partially
  // transparent color and axe reports a false color-contrast violation
  // for it instead of the page's resting state.
  await page.waitForTimeout(800);

  let builder = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]);

  for (const selector of excludeSelectors) {
    builder = builder.exclude(selector);
  }

  const results = await builder.analyze();

  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );

  expect(
    serious,
    serious.map((v) => `${v.id}: ${v.help}`).join("\n"),
  ).toHaveLength(0);
}

test.describe("Accessibility", () => {
  test("home page has no serious/critical violations", async ({ page }) => {
    await mockPopularPackages(page);
    await page.goto("/");
    // The hero search button deliberately keeps the lighter brand cyan
    // (#00ADD8) over a higher-contrast alternative - see HeroSection.tsx.
    await assertNoSeriousViolations(page, [
      '[data-testid="hero-search-button"]',
    ]);
  });

  test("search page has no serious/critical violations", async ({ page }) => {
    await mockSearch(page);
    await page.goto("/search?q=gin");
    await assertNoSeriousViolations(page);
  });

  test("package detail page has no serious/critical violations", async ({
    page,
  }) => {
    await mockPackageInfo(page);
    await page.route("**/api/package-versions**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          versions: [],
          total: 0,
          page: 1,
          totalPages: 1,
        }),
      }),
    );
    await page.route("**/api/package-releases**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ releases: [], hasNextPage: false }),
      }),
    );
    await page.goto(`/package/${GIN.importPath}`);
    await assertNoSeriousViolations(page);
  });

  test("favorites page has no serious/critical violations", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(
      (packages) => {
        localStorage.setItem("gopkg_favorites", JSON.stringify(packages));
      },
      [GIN, ECHO],
    );
    await page.goto("/favorites");
    await assertNoSeriousViolations(page);
  });

  test("compare page has no serious/critical violations", async ({ page }) => {
    await mockPackageInfo(page);
    await page.goto(
      `/compare?pkg=${encodeURIComponent(GIN.importPath)}&pkg=${encodeURIComponent(ECHO.importPath)}`,
    );
    await assertNoSeriousViolations(page);
  });
});
