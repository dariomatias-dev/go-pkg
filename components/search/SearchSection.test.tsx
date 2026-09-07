import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";

import SearchSection from "./SearchSection";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function searchResponse(overrides: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({
      results: [
        {
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
        },
      ],
      totalResults: 1,
      page: 1,
      perPage: 10,
      hasMore: false,
      ...overrides,
    }),
  );
}

function renderSection(
  props: Partial<Parameters<typeof SearchSection>[0]> = {},
) {
  return render(
    <TooltipProvider>
      <SearchSection {...props} />
    </TooltipProvider>,
  );
}

describe("SearchSection", () => {
  beforeEach(() => {
    push.mockClear();
    window.scrollTo = vi.fn();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("debounces the search request and renders results", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    renderSection({ initialQuery: "gin" });

    expect(await screen.findByText("gin")).toBeInTheDocument();

    const [url] = vi.mocked(fetch).mock.calls[0];

    expect(String(url)).toContain("q=gin");
  });

  it("shows the empty prompt when there is no query and no results", async () => {
    vi.mocked(fetch).mockResolvedValue(
      searchResponse({ results: [], totalResults: 0 }),
    );

    renderSection();

    expect(
      await screen.findByText(/search for a go package to display/i),
    ).toBeInTheDocument();
  });

  it("shows an error banner when the search request fails", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "Rate limited." } }), {
        status: 429,
      }),
    );

    renderSection({ initialQuery: "gin" });

    expect(await screen.findByText("Rate limited.")).toBeInTheDocument();
  });

  it("resets all filters and navigates to /search on Clear All", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const user = userEvent.setup();

    renderSection({ initialQuery: "gin", initialCategory: "web" });

    await screen.findByText("gin");

    await user.click(screen.getByRole("button", { name: /clear all/i }));

    expect(push).toHaveBeenCalledWith("/search");
  });

  it("pushes a route with the selected category", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const user = userEvent.setup();

    renderSection({
      initialCategories: [
        { id: "web", name: "Web", description: "", iconName: "Globe" },
      ],
    });

    await screen.findByText("gin");

    await user.click(screen.getByText("Web"));

    expect(push).toHaveBeenCalledWith("/search?category=web", {
      scroll: false,
    });
  });
});
