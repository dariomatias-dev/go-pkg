import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

window.scrollTo = () => {};

// API routes use the Next.js Cache Components directive ("use cache" +
// cacheLife), which needs a real request/build context. It is a no-op
// under Vitest, so the module is stubbed instead of erroring.
vi.mock("next/cache", () => ({
  cacheLife: () => {},
  cacheTag: () => {},
  revalidateTag: () => {},
}));
