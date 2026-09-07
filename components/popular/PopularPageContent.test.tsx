import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { PopularPackage } from "@/types";

import { PopularPageContent } from "./PopularPageContent";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
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

function response(packages: PopularPackage[], total: number) {
  return new Response(JSON.stringify({ packages, total }));
}

function renderContent() {
  return render(
    <TooltipProvider>
      <PopularPageContent />
    </TooltipProvider>,
  );
}

describe("PopularPageContent", () => {
  beforeEach(() => {
    replace.mockClear();
    window.scrollTo = vi.fn();
    window.history.replaceState({}, "", "/popular");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads and renders the first page of popular packages", async () => {
    vi.mocked(fetch).mockResolvedValue(response([pkg()], 25));

    renderContent();

    expect(await screen.findByText("gin")).toBeInTheDocument();

    const [url] = vi.mocked(fetch).mock.calls[0];

    expect(String(url)).toContain("page=1");
  });

  it("shows an error message when the request fails", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "Rate limited." } }), {
        status: 503,
      }),
    );

    renderContent();

    expect(await screen.findByText("Rate limited.")).toBeInTheDocument();
  });

  it("changes page, updates the URL and scrolls to top", async () => {
    vi.mocked(fetch).mockResolvedValue(response([pkg()], 25));

    const user = userEvent.setup();

    renderContent();

    await screen.findByText("gin");

    vi.mocked(fetch).mockResolvedValue(
      response(
        [pkg({ importPath: "github.com/labstack/echo", name: "echo" })],
        25,
      ),
    );

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText("echo")).toBeInTheDocument();
    expect(replace).toHaveBeenCalledWith("?page=2", { scroll: false });
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("reads the initial page from the URL's ?page= param", async () => {
    window.history.replaceState({}, "", "/popular?page=3");
    vi.mocked(fetch).mockResolvedValue(response([pkg()], 40));

    renderContent();

    await waitFor(() => {
      const [url] = vi.mocked(fetch).mock.calls[0];

      expect(String(url)).toContain("page=3");
    });
  });
});
