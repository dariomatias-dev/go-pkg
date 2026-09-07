import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "./Footer";

describe("Footer", () => {
  it("shows the current year in the copyright line", () => {
    render(<Footer />);

    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()}.*GOPKG`, "i")),
    ).toBeInTheDocument();
  });

  it("links to the GitHub repository", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: /github repository/i }),
    ).toHaveAttribute("href", "https://github.com/dariomatias-dev/go-pkg");
  });

  it("scrolls to top when 'Back to top' is clicked", async () => {
    window.scrollTo = vi.fn();

    const user = userEvent.setup();

    render(<Footer />);

    await user.click(screen.getByRole("button", { name: /back to top/i }));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
