import { expect, test } from "@playwright/test";

import { mockPopularPackages } from "./fixtures/mockApi";

test.describe("Theme", () => {
  test("switching to dark mode persists across navigation", async ({
    page,
  }) => {
    await mockPopularPackages(page);
    await page.goto("/");

    await page.locator("header button:has(svg.lucide-sun)").click();
    await page.getByRole("menuitem", { name: "Dark" }).click();

    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto("/popular");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
