import { expect, test } from "@playwright/test";

import { mockPopularPackages } from "./fixtures/mockApi";
import { GIN } from "./fixtures/packages";

test.describe("Home page", () => {
  test("loads with categories and popular packages", async ({ page }) => {
    await mockPopularPackages(page);
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /discover the best packages/i }),
    ).toBeVisible();

    await expect(page.getByText("Web Frameworks & APIs").first()).toBeVisible();

    await expect(page.getByText(GIN.name).first()).toBeVisible();
  });

  test("navigates to a package's detail page from a card", async ({ page }) => {
    await mockPopularPackages(page);
    await page.goto("/");

    await page.getByRole("link", { name: GIN.name }).first().click();

    await expect(page).toHaveURL(/\/package\/github\.com/);
  });
});
