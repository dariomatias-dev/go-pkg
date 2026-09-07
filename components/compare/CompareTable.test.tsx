import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { GoPackage } from "@/types";

import { CompareTable } from "./CompareTable";

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

describe("CompareTable", () => {
  it("shows a loading placeholder for a package that hasn't resolved yet", () => {
    render(
      <CompareTable
        pkgPaths={["github.com/gin-gonic/gin"]}
        compared={[]}
        removePackage={vi.fn()}
        inspectPackage={vi.fn()}
      />,
    );

    expect(screen.getAllByLabelText("Loading").length).toBeGreaterThan(0);
    expect(screen.getByText("gin")).toBeInTheDocument();
  });

  it("fills unused slots with empty placeholders up to 3 columns", () => {
    const { container } = render(
      <CompareTable
        pkgPaths={["github.com/gin-gonic/gin"]}
        compared={[pkg()]}
        removePackage={vi.fn()}
        inspectPackage={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Empty Slot")).toHaveLength(2);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it("removes a package when its trash button is clicked", async () => {
    const user = userEvent.setup();
    const removePackage = vi.fn();

    render(
      <CompareTable
        pkgPaths={["github.com/gin-gonic/gin"]}
        compared={[pkg()]}
        removePackage={removePackage}
        inspectPackage={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /remove gin from comparison/i }),
    );

    expect(removePackage).toHaveBeenCalledWith("github.com/gin-gonic/gin");
  });

  it("inspects a package when Details is clicked", async () => {
    const user = userEvent.setup();
    const inspectPackage = vi.fn();

    render(
      <CompareTable
        pkgPaths={["github.com/gin-gonic/gin"]}
        compared={[pkg()]}
        removePackage={vi.fn()}
        inspectPackage={inspectPackage}
      />,
    );

    await user.click(screen.getByRole("button", { name: /details/i }));

    expect(inspectPackage).toHaveBeenCalledWith("github.com/gin-gonic/gin");
  });
});
