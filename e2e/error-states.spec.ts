import { expect, test } from "@playwright/test";

test.describe("Error states", () => {
  test("search shows the GitHub rate-limit message instead of an empty result list", async ({
    page,
  }) => {
    await page.route("**/api/search**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: "service_unavailable",
            message:
              "GitHub API rate limit exceeded (search). Set GITHUB_TOKEN in your environment to increase the limit from 60 to 5000 requests/hour.",
          },
        }),
      }),
    );

    await page.goto("/search?q=gin");

    await expect(page.getByText(/rate limit exceeded/i)).toBeVisible();
    // Not silently rendered as "no results" with no explanation.
    await expect(page.getByText(/no packages found/i)).toHaveCount(0);
  });

  test("home's popular packages widget shows the error instead of an empty list", async ({
    page,
  }) => {
    await page.route("**/api/popular-package**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: "service_unavailable",
            message: "GitHub API rate limit exceeded (popular packages).",
          },
        }),
      }),
    );

    await page.goto("/");

    await expect(page.getByText(/rate limit exceeded/i)).toBeVisible();
  });

  test("popular page shows the error instead of an empty list", async ({
    page,
  }) => {
    await page.route("**/api/popular-package**", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            code: "service_unavailable",
            message: "GitHub API rate limit exceeded (popular packages).",
          },
        }),
      }),
    );

    await page.goto("/popular");

    await expect(page.getByText(/rate limit exceeded/i)).toBeVisible();
  });
});
