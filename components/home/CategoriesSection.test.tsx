import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CategoriesSection } from "./CategoriesSection";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("CategoriesSection", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("shows skeleton placeholders while loading", () => {
    const { container } = render(<CategoriesSection loading={true} />);

    expect(container.querySelectorAll(".animate-shimmer").length).toBe(6);
    expect(screen.queryByText("Web Frameworks & APIs")).not.toBeInTheDocument();
  });

  it("renders every curated category once loaded", () => {
    render(<CategoriesSection />);

    expect(screen.getByText("Web Frameworks & APIs")).toBeInTheDocument();
    expect(screen.getByText("Databases & ORMs")).toBeInTheDocument();
  });

  it("navigates to the filtered search when a category is clicked", async () => {
    const user = userEvent.setup();

    render(<CategoriesSection />);

    await user.click(screen.getByText("Web Frameworks & APIs"));

    expect(push).toHaveBeenCalledWith("/search?category=web");
  });

  it("navigates to the unfiltered search from 'View all packages'", async () => {
    const user = userEvent.setup();

    render(<CategoriesSection />);

    await user.click(screen.getByText(/view all packages/i));

    expect(push).toHaveBeenCalledWith("/search");
  });
});
