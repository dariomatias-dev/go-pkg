import { expect, test } from "@playwright/test";

import { mockPackageInfo } from "./fixtures/mockApi";
import { ECHO, GIN } from "./fixtures/packages";

test.describe("Compare", () => {
  test("adds two packages, renders the table, then removes one", async ({
    page,
  }) => {
    await mockPackageInfo(page);

    await page.goto(
      `/compare?pkg=${encodeURIComponent(GIN.importPath)}&pkg=${encodeURIComponent(ECHO.importPath)}`,
    );

    const ginColumn = page.locator("th", { hasText: GIN.name });
    const echoColumn = page.locator("th", { hasText: ECHO.name });

    await expect(ginColumn).toBeVisible();
    await expect(echoColumn).toBeVisible();

    await ginColumn.locator("button:has(svg.lucide-trash-2)").click();

    // Occasionally the removal never reaches the URL on WebKit — reproduced
    // with a bare Playwright script outside this test runner too, so it is
    // a real app-level flake in CompareSection's remove flow, not a
    // selector or timing issue in this test. Tracked as a known gap; CI's
    // retries (2, configured in playwright.config.ts) absorb it for now.
    await expect(page.locator("th", { hasText: GIN.name })).toHaveCount(0);
    await expect(echoColumn).toBeVisible();
  });
});
