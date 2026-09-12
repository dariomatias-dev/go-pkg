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

  it("un-selects the category (and drops the query string) when clicking it again", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const user = userEvent.setup();

    renderSection({
      initialCategory: "web",
      initialCategories: [
        { id: "web", name: "Web", description: "", iconName: "Globe" },
      ],
    });

    await screen.findByText("gin");

    await user.click(screen.getByText("Web"));

    expect(push).toHaveBeenCalledWith("/search", { scroll: false });
  });

  it("includes the tag in the search request and can be cleared", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const user = userEvent.setup();

    renderSection({ initialTag: "cli" });

    await screen.findByText("gin");

    expect(String(vi.mocked(fetch).mock.calls[0][0])).toContain("tag=cli");

    await user.click(
      screen.getByRole("button", { name: /clear selected tag/i }),
    );

    expect(push).toHaveBeenCalledWith("/search", { scroll: false });
  });

  it("shows a generic error message when the failed response body isn't JSON", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("not json", { status: 500 }),
    );

    renderSection({ initialQuery: "gin" });

    expect(
      await screen.findByText("Failed to fetch results."),
    ).toBeInTheDocument();
  });

  it("treats a missing results field as an empty list instead of crashing", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ totalResults: 0 })),
    );

    renderSection();

    expect(
      await screen.findByText(/search for a go package to display/i),
    ).toBeInTheDocument();
  });

  it("silently ignores an aborted request instead of showing an error", async () => {
    vi.mocked(fetch).mockRejectedValue(
      Object.assign(new Error("aborted"), { name: "AbortError" }),
    );

    renderSection();

    await screen.findByText(/search for a go package to display/i);
    expect(screen.queryByText(/failed to fetch/i)).not.toBeInTheDocument();
  });

  it("pushes a route with the semantic flag when semantic search is toggled on", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const user = userEvent.setup();

    renderSection({ initialQuery: "gin", initialTag: "cli" });

    await screen.findByText("gin");

    await user.click(
      screen.getByRole("checkbox", { name: /enable semantic search/i }),
    );

    expect(push).toHaveBeenCalledWith("/search?q=gin&tag=cli&semantic=true", {
      scroll: false,
    });
  });

  it("pushes a route with the chosen sort when it differs from the default", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const user = userEvent.setup();

    renderSection();

    await screen.findByText("gin");

    await user.click(screen.getByRole("button", { name: "Stars" }));
    await user.click(await screen.findByText("Recently Updated"));

    expect(push).toHaveBeenCalledWith("/search?sort=updated", {
      scroll: false,
    });
  });

  it("pushes a route with the chosen page size when it differs from the default", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse());

    const user = userEvent.setup();

    renderSection();

    await screen.findByText("gin");

    await user.click(screen.getByRole("button", { name: "10" }));
    await user.click(await screen.findByText("20"));

    expect(push).toHaveBeenCalledWith("/search?perPage=20", {
      scroll: false,
    });
  });

  it("pushes a route with the target page when paginating past page 1", async () => {
    vi.mocked(fetch).mockResolvedValue(searchResponse({ totalResults: 25 }));

    const user = userEvent.setup();

    renderSection();

    await screen.findByText("gin");

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(push).toHaveBeenCalledWith("/search?page=2", { scroll: false });
  });

  it("resolves a query without a slash against github.com/<query>/<query>", async () => {
    vi.mocked(fetch).mockResolvedValue(
      searchResponse({ results: [], totalResults: 0 }),
    );

    const user = userEvent.setup();

    renderSection({ initialQuery: "gin" });

    await user.click(
      await screen.findByRole("button", { name: /resolve via go proxy/i }),
    );

    expect(push).toHaveBeenCalledWith("/package/github.com/gin/gin");
  });

  it("resolves a query that already has a slash as-is", async () => {
    vi.mocked(fetch).mockResolvedValue(
      searchResponse({ results: [], totalResults: 0 }),
    );

    const user = userEvent.setup();

    renderSection({ initialQuery: "gin-gonic/gin" });

    await user.click(
      await screen.findByRole("button", { name: /resolve via go proxy/i }),
    );

    expect(push).toHaveBeenCalledWith("/package/gin-gonic/gin");
  });
});
