import { expect, test } from "@playwright/test";

test.describe("Not found", () => {
  test("an unknown route renders the not-found page", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
  });
});
