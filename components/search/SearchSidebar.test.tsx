import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { CuratedCategory } from "@/types";

import { SearchSidebar } from "./SearchSidebar";

const categories: CuratedCategory[] = [
  { id: "web", name: "Web Frameworks", description: "", iconName: "Globe" },
  { id: "database", name: "Databases", description: "", iconName: "Database" },
];

function baseProps() {
  return {
    category: "",
    tag: "",
    semanticSearch: false,
    categories,
    hasFilter: false,
    onSemanticChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onTagClear: vi.fn(),
    onClearAll: vi.fn(),
  };
}

describe("SearchSidebar", () => {
  it("hides Clear All when there is no active filter", () => {
    render(<SearchSidebar {...baseProps()} />);

    expect(
      screen.queryByRole("button", { name: /clear all/i }),
    ).not.toBeInTheDocument();
  });

  it("shows and triggers Clear All when a filter is active", async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();

    render(
      <SearchSidebar
        {...baseProps()}
        hasFilter={true}
        onClearAll={onClearAll}
      />,
    );

    await user.click(screen.getByRole("button", { name: /clear all/i }));

    expect(onClearAll).toHaveBeenCalled();
  });

  it("toggles semantic search", async () => {
    const user = userEvent.setup();
    const onSemanticChange = vi.fn();

    render(
      <SearchSidebar {...baseProps()} onSemanticChange={onSemanticChange} />,
    );

    await user.click(
      screen.getByRole("checkbox", { name: /enable semantic search/i }),
    );

    expect(onSemanticChange).toHaveBeenCalledWith(true);
  });

  it("lists categories with a total count and selects one", async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();

    render(
      <SearchSidebar {...baseProps()} onCategoryChange={onCategoryChange} />,
    );

    expect(screen.getByText("2")).toBeInTheDocument();

    await user.click(screen.getByText("Web Frameworks"));

    expect(onCategoryChange).toHaveBeenCalledWith("web");
  });

  it("resets to all categories when 'All Categories' is clicked", async () => {
    const user = userEvent.setup();
    const onCategoryChange = vi.fn();

    render(
      <SearchSidebar
        {...baseProps()}
        category="web"
        onCategoryChange={onCategoryChange}
      />,
    );

    await user.click(screen.getByText("All Categories"));

    expect(onCategoryChange).toHaveBeenCalledWith("");
  });

  it("shows the selected tag and clears it", async () => {
    const user = userEvent.setup();
    const onTagClear = vi.fn();

    render(
      <SearchSidebar {...baseProps()} tag="caching" onTagClear={onTagClear} />,
    );

    expect(screen.getByText("#caching")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /clear selected tag/i }),
    );

    expect(onTagClear).toHaveBeenCalled();
  });
});
