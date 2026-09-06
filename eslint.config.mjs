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
      // jsx-a11y recommended rules start as warnings: the existing
      // violations are fixed in the accessibility pass (see plan.md,
      // Etapa 6), which then promotes these to errors.
      ...Object.fromEntries(
        Object.entries(jsxA11y.flatConfigs.recommended.rules).map(([rule]) => [
          rule,
          "warn",
        ]),
      ),
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["scripts/**"],
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
  ]),
]);

export default eslintConfig;
