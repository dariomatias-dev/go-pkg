import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // jsx-a11y recommended rules: promoted from warn to error in
      // Etapa 6 once the violations they caught (icon-only buttons,
      // clickable divs, unlabeled inputs) were fixed.
      ...Object.fromEntries(
        Object.entries(jsxA11y.flatConfigs.recommended.rules).map(([rule]) => [
          rule,
          "error",
        ]),
      ),
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      // Default depth (2) is too shallow for this codebase's typical
      // nesting (icon + text wrapped in a couple of layout divs), which
      // flags controls that do have a visible text label a few levels
      // down as unlabeled.
      "jsx-a11y/control-has-associated-label": ["error", { depth: 6 }],
    },
  },
  {
    files: ["scripts/**", "lib/logger.ts", "lib/logger.test.ts"],
    rules: {
      "no-console": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
