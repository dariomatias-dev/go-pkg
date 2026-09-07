import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { PopularPackage, PopularPackageResponse } from "@/types";

import { PopularPackageSection } from "./PopularPackageSection";

const push = vi.fn();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

function pkg(overrides: Partial<PopularPackage> = {}): PopularPackage {
  return {
    importPath: "github.com/gin-gonic/gin",
    name: "gin",
    description: "A web framework",
    stars: 100,
    category: "web",
    tags: ["web"],
    ...overrides,
  };
}

function response(overrides: Partial<PopularPackageResponse> = {}) {
  return new Response(
    JSON.stringify({
      packages: [pkg()],
      categories: [],
      popularTags: ["web", "cli"],
      page: 1,
      perPage: 4,
      total: 10,
      hasMore: true,
      ...overrides,
    }),
  );
}

function renderSection() {
  return render(
    <TooltipProvider>
      <PopularPackageSection />
    </TooltipProvider>,
  );
}

describe("PopularPackageSection", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    replace.mockClear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads and renders popular packages and tags", async () => {
    vi.mocked(fetch).mockResolvedValue(response());

    renderSection();

    expect(await screen.findByText("gin")).toBeInTheDocument();
    expect(screen.getByText("#web")).toBeInTheDocument();
    expect(screen.getByText("#cli")).toBeInTheDocument();
  });

  it("shows an error message when the initial load fails", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "Rate limited." } }), {
        status: 503,
      }),
    );

    renderSection();

    expect(await screen.findByText("Rate limited.")).toBeInTheDocument();
  });

  it("loads more packages and updates the URL", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(response());

    const user = userEvent.setup();

    renderSection();

    await screen.findByText("gin");

    vi.mocked(fetch).mockResolvedValueOnce(
      response({
        packages: [pkg({ importPath: "github.com/labstack/echo", name: "echo" })],
        hasMore: false,
      }),
    );

    await user.click(screen.getByRole("button", { name: /load more/i }));

    expect(await screen.findByText("echo")).toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith("?page=2", { scroll: false });
    expect(
      screen.queryByRole("button", { name: /load more/i }),
    ).not.toBeInTheDocument();
  });

  it("shows favorites with a working remove action", async () => {
    localStorage.setItem("gopkg_favorites", JSON.stringify([pkg()]));
    vi.mocked(fetch).mockResolvedValue(response({ packages: [] }));

    const user = userEvent.setup();

    renderSection();

    await waitFor(() => expect(screen.getByText("Your Favorites (1)")).toBeInTheDocument());

    await user.click(
      screen.getByRole("button", { name: /remove gin from favorites/i }),
    );

    expect(screen.getByText("No saved packages.")).toBeInTheDocument();
  });

  it("navigates to /popular from View All", async () => {
    vi.mocked(fetch).mockResolvedValue(response());

    const user = userEvent.setup();

    renderSection();

    await screen.findByText("gin");
    await user.click(screen.getByRole("button", { name: /view all/i }));

    expect(push).toHaveBeenCalledWith("/popular");
  });
});
