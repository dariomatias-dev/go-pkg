import { expect, test } from "@playwright/test";

import { mockPackageInfo } from "./fixtures/mockApi";
import { GIN } from "./fixtures/packages";

test.describe("Package detail", () => {
  test("switches between README, go.mod and versions tabs", async ({
    page,
  }) => {
    await mockPackageInfo(page);
    await page.route("**/api/package-versions**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          versions: ["v1.10.0", "v1.9.1"],
          total: 2,
          page: 1,
          totalPages: 1,
        }),
      }),
    );
    await page.route("**/api/package-releases**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ releases: [] }),
      }),
    );

    await page.goto(`/package/${GIN.importPath}`);

    await expect(page.getByText("A fast HTTP web framework")).toBeVisible();

    await page.getByRole("button", { name: /inspect go\.mod/i }).click();
    await expect(page.getByText(/go\.mod file for version/i)).toBeVisible();

    await page.getByRole("button", { name: /versions & releases/i }).click();
    await expect(page.getByText("v1.10.0").first()).toBeVisible();
  });
});
