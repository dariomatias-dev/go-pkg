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

  it("stops click propagation on the GitHub, license and author links", async () => {
    const user = userEvent.setup();

    renderCard({ pkg: pkg() });

    await user.click(screen.getByRole("link", { name: /github/i }));
    await user.click(screen.getByRole("link", { name: /mit/i }));
    await user.click(screen.getByRole("link", { name: /@gin-gonic/ }));

    // The card wraps a stretched Link over the whole surface; the
    // detail-page navigation link itself must not have been the one
    // clicked (its href differs from the three above).
    expect(screen.getByRole("link", { name: "gin" })).toHaveAttribute(
      "href",
      "/package/github.com/gin-gonic/gin",
    );
  });

  it("hides the author link when there is no author", () => {
    renderCard({ pkg: pkg({ author: "" }) });

    expect(screen.queryByText(/@gin-gonic/)).not.toBeInTheDocument();
  });

  it("hides the GitHub link when there is no githubUrl", () => {
    renderCard({ pkg: pkg({ githubUrl: undefined }) });

    expect(
      screen.queryByRole("link", { name: /github/i }),
    ).not.toBeInTheDocument();
  });

  it("points the license link at # when there is no githubUrl", () => {
    renderCard({ pkg: pkg({ githubUrl: undefined, license: "MIT" }) });

    expect(screen.getByRole("link", { name: /mit/i })).toHaveAttribute(
      "href",
      "#",
    );
  });

  it("hides the category badge when there is no category", () => {
    renderCard({ pkg: pkg({ category: "" }) });

    expect(screen.queryByText("web")).not.toBeInTheDocument();
  });

  it("shows a similarity score bar when similarityScore is set", () => {
    const { container } = renderCard({
      pkg: pkg({ similarityScore: 0.85 }),
    });

    const bar = container.querySelector(
      ".bg-linear-to-r.from-cyan-400",
    ) as HTMLElement | null;

    expect(bar).not.toBeNull();
    expect(bar?.style.width).toBe("85%");
  });

  it("treats a similarityScore already expressed as a percentage as-is", () => {
    const { container } = renderCard({
      pkg: pkg({ similarityScore: 42 }),
    });

    const bar = container.querySelector(
      ".bg-linear-to-r.from-cyan-400",
    ) as HTMLElement | null;

    expect(bar?.style.width).toBe("42%");
  });
});
