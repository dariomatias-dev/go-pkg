import { expect, test } from "@playwright/test";

import { mockSearch } from "./fixtures/mockApi";
import { GIN } from "./fixtures/packages";

test.describe("Search", () => {
  test("typing a query and submitting navigates to results", async ({
    page,
  }) => {
    await mockSearch(page);
    await page.goto("/");

    const input = page.getByPlaceholder("Search Go packages...");

    await input.fill("gin");
    await input.press("Enter");

    await expect(page).toHaveURL(/\/search\?q=gin/);
    await expect(page.getByText(GIN.description).first()).toBeVisible();
  });

  test("filtering by category updates the results", async ({ page }) => {
    let lastUrl = "";

    await page.route("**/api/search**", (route) => {
      lastUrl = route.request().url();

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [GIN],
          totalResults: 1,
          page: 1,
          perPage: 10,
          hasMore: false,
        }),
      });
    });

    await page.goto("/search?q=web&category=web");

    await expect(page.getByText(GIN.name).first()).toBeVisible();
    expect(lastUrl).toContain("category=web");
  });
});
