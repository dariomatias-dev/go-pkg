import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePackageDetail } from "./usePackageDetail";

const replace = vi.fn();
const router = { replace };

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/package/github.com/gin-gonic/gin",
}));

function packageInfoResponse(overrides: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({
      pkg: {
        name: "gin",
        importPath: "github.com/gin-gonic/gin",
        readme: "# Gin",
        ...overrides,
      },
      goMod: "",
      isCustom: false,
    }),
  );
}

describe("usePackageDetail", () => {
  beforeEach(() => {
    replace.mockClear();
    vi.stubGlobal("fetch", vi.fn());
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads package data and switches to the readme tab when a README exists", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(packageInfoResponse());

    const { result } = renderHook(() =>
      usePackageDetail("github.com/gin-gonic/gin"),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data?.pkg.name).toBe("gin");
    expect(result.current.activeTab).toBe("readme");
  });

  it("switches to the summary tab and fetches an AI summary when there is no README", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(packageInfoResponse({ readme: "" }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ summary: "A short summary." })),
      );

    const { result } = renderHook(() =>
      usePackageDetail("github.com/gin-gonic/gin"),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.activeTab).toBe("summary"));
    await waitFor(() =>
      expect(result.current.aiSummary).toBe("A short summary."),
    );
  });

  it("surfaces a load error without crashing", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));

    const { result } = renderHook(() =>
      usePackageDetail("github.com/gin-gonic/gin"),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toMatch(/couldn't load this package/i);
  });

  it("discards a stale response when importPath changes before it resolves", async () => {
    // Mirrors real fetch()/AbortController behavior: a request whose
    // signal is aborted rejects with an AbortError, which is how the
    // hook guards against a slow first response overwriting a faster
    // second one (the regression fixed in commit 547f073).
    vi.mocked(fetch).mockImplementationOnce(
      (_input, init?: RequestInit) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            const err = new Error("The operation was aborted.");
            err.name = "AbortError";
            reject(err);
          });
        }),
    );
    vi.mocked(fetch).mockResolvedValueOnce(
      packageInfoResponse({
        name: "echo",
        importPath: "github.com/labstack/echo",
      }),
    );

    const { result, rerender } = renderHook(
      ({ importPath }: { importPath: string }) => usePackageDetail(importPath),
      { initialProps: { importPath: "github.com/gin-gonic/gin" } },
    );

    rerender({ importPath: "github.com/labstack/echo" });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data?.pkg.name).toBe("echo");
    expect(result.current.error).toBeNull();
  });
});
