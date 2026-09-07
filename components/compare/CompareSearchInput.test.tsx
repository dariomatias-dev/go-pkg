import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { GoPackage } from "@/types";

import { CompareSearchInput } from "./CompareSearchInput";

function pkg(overrides: Partial<GoPackage> = {}): GoPackage {
  return {
    name: "gin",
    importPath: "github.com/gin-gonic/gin",
    description: "A web framework",
    stars: 1234,
    forks: 10,
    license: "MIT",
    latestVersion: "v1.9.0",
    category: "web",
    tags: ["web"],
    author: "gin-gonic",
    publishedAt: "2024-01-01",
    ...overrides,
  };
}

function baseProps() {
  return {
    pkgCount: 0,
    searchQuery: "",
    dropdownOpen: false,
    suggestions: [] as GoPackage[],
    suggestionsLoading: false,
    onChange: vi.fn(),
    onFocus: vi.fn(),
    onDropdownClose: vi.fn(),
    onAddPackage: vi.fn(),
  };
}

describe("CompareSearchInput", () => {
  it("disables the input and shows the limit message once 3 packages are added", () => {
    render(<CompareSearchInput {...baseProps()} pkgCount={3} />);

    const input = screen.getByRole("textbox");

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("placeholder", "Limit reached (3/3)");
  });

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<CompareSearchInput {...baseProps()} onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "gin");

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith("n");
  });

  it("clears the query when the clear button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CompareSearchInput
        {...baseProps()}
        searchQuery="gin"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("shows the loading indicator while suggestions load", () => {
    render(
      <CompareSearchInput
        {...baseProps()}
        dropdownOpen={true}
        suggestionsLoading={true}
      />,
    );

    expect(screen.getByText(/searching repository/i)).toBeInTheDocument();
  });

  it("shows a no-results message when the search yields nothing", () => {
    render(
      <CompareSearchInput
        {...baseProps()}
        dropdownOpen={true}
        searchQuery="doesnotexist"
        suggestions={[]}
      />,
    );

    expect(screen.getByText(/no packages found/i)).toBeInTheDocument();
  });

  it("adds a package and closes the dropdown when a suggestion is clicked", async () => {
    const user = userEvent.setup();
    const onAddPackage = vi.fn();
    const onDropdownClose = vi.fn();
    const suggestion = pkg();

    render(
      <CompareSearchInput
        {...baseProps()}
        dropdownOpen={true}
        suggestions={[suggestion]}
        onAddPackage={onAddPackage}
        onDropdownClose={onDropdownClose}
      />,
    );

    await user.click(screen.getByText("gin"));

    expect(onAddPackage).toHaveBeenCalledWith(suggestion);
    expect(onDropdownClose).toHaveBeenCalled();
  });

  it("closes the dropdown when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onDropdownClose = vi.fn();

    const { container } = render(
      <CompareSearchInput
        {...baseProps()}
        dropdownOpen={true}
        onDropdownClose={onDropdownClose}
      />,
    );

    await user.click(container.querySelector(".fixed.inset-0")!);

    expect(onDropdownClose).toHaveBeenCalled();
  });
});
