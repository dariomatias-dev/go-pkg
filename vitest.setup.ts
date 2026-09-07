import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

window.scrollTo = () => {};

// jsdom has no ResizeObserver. Radix's popper (used by Tooltip, Select's
// DropdownMenu, etc.) reads it when positioning open content, which throws
// an uncaught error async enough to sometimes get attributed to whichever
// test happens to be running next.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverStub);

// API routes use the Next.js Cache Components directive ("use cache" +
// cacheLife), which needs a real request/build context. It is a no-op
// under Vitest, so the module is stubbed instead of erroring.
vi.mock("next/cache", () => ({
  cacheLife: () => {},
  cacheTag: () => {},
  revalidateTag: () => {},
}));
