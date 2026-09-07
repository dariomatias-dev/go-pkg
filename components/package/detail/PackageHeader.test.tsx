import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { GoPackage } from "@/types";

import { PackageHeader } from "./PackageHeader";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function pkg(overrides: Partial<GoPackage> = {}): GoPackage {
  return {
    name: "gin",
    importPath: "github.com/gin-gonic/gin",
    description: "A web framework",
    stars: 1500,
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

function renderHeader(p: GoPackage) {
  return render(
    <TooltipProvider>
      <PackageHeader pkg={p} />
    </TooltipProvider>,
  );
}

describe("PackageHeader", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
  });

  it("shows the High Demand badge above 1000 stars", () => {
    renderHeader(pkg({ stars: 1500 }));

    expect(screen.getByText("High Demand")).toBeInTheDocument();
  });

  it("hides the High Demand badge at or below 1000 stars", () => {
    renderHeader(pkg({ stars: 900 }));

    expect(screen.queryByText("High Demand")).not.toBeInTheDocument();
  });

  it("copies the current URL and shows Copied feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    renderHeader(pkg());

    await user.click(screen.getByRole("button", { name: /share/i }));

    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("navigates to compare with the package preselected", async () => {
    const user = userEvent.setup();

    renderHeader(pkg());

    await user.click(screen.getByRole("button", { name: /^compare$/i }));

    expect(push).toHaveBeenCalledWith(
      "/compare?pkg=github.com%2Fgin-gonic%2Fgin",
    );
  });

  it("toggles the favorite state", async () => {
    const user = userEvent.setup();

    renderHeader(pkg());

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /^saved$/i }),
      ).toBeInTheDocument(),
    );
    expect(localStorage.getItem("gopkg_favorites")).toContain(
      "github.com/gin-gonic/gin",
    );
  });

  it("shows N/A for a missing license", () => {
    renderHeader(pkg({ license: "" }));

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
