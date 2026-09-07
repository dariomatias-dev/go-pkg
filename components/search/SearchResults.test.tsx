import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { GoPackage } from "@/types";

import { SearchResults } from "./SearchResults";

function renderResults(props: Parameters<typeof SearchResults>[0]) {
  return render(
    <TooltipProvider>
      <SearchResults {...props} />
    </TooltipProvider>,
  );
}

function pkg(overrides: Partial<GoPackage> = {}): GoPackage {
  return {
    name: "gin",
    importPath: "github.com/gin-gonic/gin",
    description: "A web framework",
    stars: 100,
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
    loading: false,
    error: null as string | null,
    results: [] as GoPackage[],
    totalResults: 0,
    perPage: 10,
    currentPage: 1,
    query: "",
    hasFilter: false,
    onPageChange: vi.fn(),
    onResolveProxy: vi.fn(),
  };
}

describe("SearchResults", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the error message when there is an error", () => {
    render(<SearchResults {...baseProps()} error="Something went wrong." />);

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("shows skeletons while loading", () => {
    const { container } = render(
      <SearchResults {...baseProps()} loading={true} />,
    );

    expect(
      container.querySelectorAll(".animate-shimmer").length,
    ).toBeGreaterThan(0);
  });

  it("renders result cards and pagination when there are more results than perPage", () => {
    renderResults({
      ...baseProps(),
      results: [pkg()],
      totalResults: 25,
      perPage: 10,
    });

    expect(screen.getByText("gin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("hides pagination when results fit on one page", () => {
    renderResults({ ...baseProps(), results: [pkg()], totalResults: 1 });

    expect(
      screen.queryByRole("button", { name: /next/i }),
    ).not.toBeInTheDocument();
  });

  it("shows a no-match state with a resolve action when filtered and empty", async () => {
    const user = userEvent.setup();
    const onResolveProxy = vi.fn();

    render(
      <SearchResults
        {...baseProps()}
        hasFilter={true}
        query="unknownpkg"
        onResolveProxy={onResolveProxy}
      />,
    );

    expect(
      screen.getByText(/no packages match your search/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /resolve via go proxy/i }),
    );

    expect(onResolveProxy).toHaveBeenCalled();
  });

  it("shows a prompt to search when idle with no filter", () => {
    render(<SearchResults {...baseProps()} />);

    expect(
      screen.getByText(/search for a go package to display/i),
    ).toBeInTheDocument();
  });
});
