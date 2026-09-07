import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/common/Tooltip";
import type { GoPackage } from "@/types";

import { PackageTabs } from "./PackageTabs";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/package/github.com/gin-gonic/gin",
  useSearchParams: () => new URLSearchParams(),
}));

function renderTabs(props: Parameters<typeof PackageTabs>[0]) {
  return render(
    <TooltipProvider>
      <PackageTabs {...props} />
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
    versions: ["v1.9.0"],
    readme: "# Gin",
    category: "web",
    tags: ["web"],
    author: "gin-gonic",
    publishedAt: "2024-01-01",
    ...overrides,
  };
}

function baseProps() {
  return {
    pkg: pkg(),
    goMod: "module github.com/gin-gonic/gin",
    activeTab: "summary" as const,
    aiSummary: "",
    aiSummaryLoading: false,
    aiSummaryError: null,
    onTabChange: vi.fn(),
    onRetryAiSummary: vi.fn(),
  };
}

describe("PackageTabs", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls onTabChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();

    renderTabs({ ...baseProps(), onTabChange });

    await user.click(
      screen.getByRole("button", { name: /documentation \/ readme/i }),
    );

    expect(onTabChange).toHaveBeenCalledWith("readme");
  });

  it("renders the README tab content when active", () => {
    renderTabs({ ...baseProps(), activeTab: "readme" });

    expect(screen.getByRole("heading", { name: "Gin" })).toBeInTheDocument();
  });

  it("lazily renders the AI summary tab when active", async () => {
    renderTabs({
      ...baseProps(),
      activeTab: "summary",
      aiSummary: "A **great** package.",
    });

    await waitFor(() =>
      expect(screen.getByText("great")).toBeInTheDocument(),
    );
  });

  it("lazily renders the go.mod tab when active", async () => {
    renderTabs({ ...baseProps(), activeTab: "goMod" });

    await waitFor(() =>
      expect(
        screen.getByText(/go\.mod file for version v1\.9\.0/i),
      ).toBeInTheDocument(),
    );
  });
});
