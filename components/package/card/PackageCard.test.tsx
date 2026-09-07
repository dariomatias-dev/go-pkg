import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { GoPackage } from "@/types";

import { PackageCard } from "./PackageCard";

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
    githubUrl: "https://github.com/gin-gonic/gin",
    publishedAt: "2024-01-01",
    ...overrides,
  };
}

function renderCard(props: Parameters<typeof PackageCard>[0]) {
  return render(
    <TooltipProvider>
      <PackageCard {...props} />
    </TooltipProvider>,
  );
}

describe("PackageCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the package name, import path and stats", () => {
    renderCard({ pkg: pkg() });

    expect(screen.getByText("gin")).toBeInTheDocument();
    expect(screen.getByText("github.com/gin-gonic/gin")).toBeInTheDocument();
    expect(screen.getByText((1234).toLocaleString())).toBeInTheDocument();
  });

  it("shows an index badge, zero-padded", () => {
    renderCard({ pkg: pkg(), index: 3 });

    expect(screen.getByText("#03")).toBeInTheDocument();
  });

  it("falls back to a default description when none is provided", () => {
    renderCard({ pkg: pkg({ description: "" }) });

    expect(
      screen.getByText(/no description provided for this package/i),
    ).toBeInTheDocument();
  });

  it("toggles the favorite state and persists it to localStorage", async () => {
    const user = userEvent.setup();

    renderCard({ pkg: pkg() });

    const saveButton = screen.getByRole("button", {
      name: /save to favorites/i,
    });

    await user.click(saveButton);

    expect(
      screen.getByRole("button", { name: /remove from favorites/i }),
    ).toBeInTheDocument();
    expect(localStorage.getItem("gopkg_favorites")).toContain(
      "github.com/gin-gonic/gin",
    );
  });

  it("links to the package detail page with an encoded import path", () => {
    renderCard({ pkg: pkg() });

    expect(screen.getByRole("link", { name: "gin" })).toHaveAttribute(
      "href",
      "/package/github.com/gin-gonic/gin",
    );
  });
});
