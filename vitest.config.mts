import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "lib/**/*.test.ts",
      "hooks/**/*.test.ts",
      "components/**/*.test.tsx",
      "app/api/**/*.test.ts",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**/*.ts", "hooks/**/*.ts"],
      exclude: [
        "lib/**/*.test.ts",
        "hooks/**/*.test.ts",
        "**/*.d.ts",
        "lib/github/types.ts",
        "lib/curated-categories.ts",
      ],
      thresholds: {
        lines: 60,
        statements: 60,
      },
    },
  },
});
