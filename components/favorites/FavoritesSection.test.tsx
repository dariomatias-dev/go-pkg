import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { GoPackage } from "@/types";

import { FavoritesSection } from "./FavoritesSection";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function renderSection() {
  return render(
    <TooltipProvider>
      <FavoritesSection />
    </TooltipProvider>,
  );
}

function favorite(overrides: Partial<GoPackage> = {}): GoPackage {
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

describe("FavoritesSection", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("shows an empty state when there are no favorites", () => {
    renderSection();

    expect(screen.getByText("No favorites yet")).toBeInTheDocument();
    expect(screen.queryByText(/PACKAGES/)).not.toBeInTheDocument();
  });

  it("navigates to search when browsing the ecosystem from the empty state", async () => {
    const user = userEvent.setup();

    renderSection();

    await user.click(
      screen.getByRole("button", { name: /browse ecosystem/i }),
    );

    expect(push).toHaveBeenCalledWith("/search");
  });

  it("renders a card per saved favorite with the running total", () => {
    localStorage.setItem(
      "gopkg_favorites",
      JSON.stringify([favorite(), favorite({ importPath: "github.com/a/b", name: "b" })]),
    );

    renderSection();

    expect(screen.getByText("2 PACKAGES")).toBeInTheDocument();
    expect(screen.queryByText("No favorites yet")).not.toBeInTheDocument();
  });
});
