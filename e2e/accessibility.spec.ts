import AxeBuilder from "@axe-core/playwright";
import { test } from "@playwright/test";

import { mockPopularPackages } from "./fixtures/mockApi";

// Baseline scan: the known jsx-a11y violations (Etapa 1, warn-level) are
// fixed in Etapa 6, which turns this into a hard assertion on zero
// serious/critical violations. For now this only reports what axe finds,
// so the accessibility gap is visible without blocking the E2E gate.
test.describe("Accessibility (baseline report)", () => {
  test("home page", async ({ page }) => {
    await mockPopularPackages(page);
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );

    // eslint-disable-next-line no-console
    console.log(
      `axe: ${serious.length} serious/critical violation(s) on / — tracked for Etapa 6`,
      serious.map((v) => v.id),
    );
  });
});
