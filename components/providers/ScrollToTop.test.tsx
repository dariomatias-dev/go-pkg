import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollToTop } from "./ScrollToTop";

let pathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

describe("ScrollToTop", () => {
  beforeEach(() => {
    pathname = "/";
    window.scrollTo = vi.fn();
  });

  it("scrolls to the top on mount", () => {
    render(<ScrollToTop />);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("scrolls to the top again when the pathname changes", () => {
    const { rerender } = render(<ScrollToTop />);

    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    pathname = "/search";
    rerender(<ScrollToTop />);

    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });

  it("renders nothing", () => {
    const { container } = render(<ScrollToTop />);

    expect(container).toBeEmptyDOMElement();
  });
});
