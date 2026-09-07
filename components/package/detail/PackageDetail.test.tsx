import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { GoPackage } from "@/types";

import { PackageDetail } from "./PackageDetail";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/package/github.com/gin-gonic/gin",
  useSearchParams: () => new URLSearchParams(),
}));

const usePackageDetail = vi.fn();

vi.mock("@/hooks/usePackageDetail", () => ({
  usePackageDetail: (...args: unknown[]) => usePackageDetail(...args),
}));

function pkg(overrides: Partial<GoPackage> = {}): GoPackage {
  return {
    name: "gin",
    importPath: "github.com/gin-gonic/gin",
    description: "A web framework",
    stars: 100,
    forks: 10,
    license: "MIT",
    latestVersion: "v1.9.0",
    readme: "# Gin",
    category: "web",
    tags: ["web"],
    author: "gin-gonic",
    githubUrl: "https://github.com/gin-gonic/gin",
    publishedAt: "2024-01-01",
    ...overrides,
  };
}

function baseHookState(overrides: Partial<ReturnType<typeof usePackageDetail>> = {}) {
  return {
    data: { pkg: pkg(), goMod: "module github.com/gin-gonic/gin" },
    loading: false,
    error: null,
    activeTab: "readme" as const,
    aiSummary: "",
    aiSummaryLoading: false,
    aiSummaryError: null,
    handleTabChange: vi.fn(),
    retryAiSummary: vi.fn(),
    ...overrides,
  };
}

function renderDetail(importPath = "github.com/gin-gonic/gin") {
  return render(
    <TooltipProvider>
      <PackageDetail importPath={importPath} />
    </TooltipProvider>,
  );
}

describe("PackageDetail", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    usePackageDetail.mockReset();
  });

  it("shows a skeleton while loading", () => {
    usePackageDetail.mockReturnValue(baseHookState({ loading: true, data: null }));

    const { container } = renderDetail();

    expect(container.querySelector(".animate-progress-slide")).toBeTruthy();
  });

  it("shows an error view when the package fails to resolve", () => {
    usePackageDetail.mockReturnValue(
      baseHookState({ loading: false, data: null, error: "Package not found." }),
    );

    renderDetail();

    expect(screen.getByText("Package not found.")).toBeInTheDocument();
  });

  it("renders the package header, breadcrumb and README tab once loaded", () => {
    usePackageDetail.mockReturnValue(baseHookState());

    renderDetail();

    expect(screen.getByRole("heading", { name: "gin" })).toBeInTheDocument();
    expect(
      screen.getAllByText("github.com/gin-gonic/gin").length,
    ).toBeGreaterThan(0);
  });

  it("shows the Go Report Card only when the package has a GitHub URL", () => {
    usePackageDetail.mockReturnValue(
      baseHookState({ data: { pkg: pkg({ githubUrl: undefined }), goMod: "" } }),
    );

    renderDetail();

    expect(screen.queryByText("Report Card")).not.toBeInTheDocument();
  });

  it("renders the Gopher AI assistant chat", () => {
    usePackageDetail.mockReturnValue(baseHookState());

    renderDetail();

    expect(
      screen.getByRole("heading", { name: /gopher ai assistant/i }),
    ).toBeInTheDocument();
  });
});
