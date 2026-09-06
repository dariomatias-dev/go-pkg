import { expect, test } from "@playwright/test";

import { mockPopularPackages } from "./fixtures/mockApi";
import { GIN } from "./fixtures/packages";

test.describe("Favorites", () => {
  test("favoriting a package persists across a reload", async ({ page }) => {
    await mockPopularPackages(page);
    await page.goto("/");

    const card = page.locator("div.cursor-pointer", {
      hasText: GIN.description,
    });
    await card.locator("button:has(svg.lucide-heart)").click();

    await page.goto("/favorites");
    await expect(page.getByText(GIN.name).first()).toBeVisible();

    await page.reload();
    await expect(page.getByText(GIN.name).first()).toBeVisible();
  });
});
