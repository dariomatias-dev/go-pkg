import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PackageDetailError } from "./PackageDetailError";

describe("PackageDetailError", () => {
  it("shows the provided error message", () => {
    render(<PackageDetailError error="Package not found." />);

    expect(screen.getByText("Package not found.")).toBeInTheDocument();
  });

  it("falls back to a generic message when no error is given", () => {
    render(<PackageDetailError error={null} />);

    expect(
      screen.getByText(/failed to load this package/i),
    ).toBeInTheDocument();
  });

  it("reloads the page when Try Again is clicked", async () => {
    const reload = vi.fn();

    Object.defineProperty(window, "location", {
      value: { ...window.location, reload },
      writable: true,
    });

    const user = userEvent.setup();

    render(<PackageDetailError error={null} />);

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(reload).toHaveBeenCalled();
  });

  it("links back to home", () => {
    render(<PackageDetailError error={null} />);

    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
