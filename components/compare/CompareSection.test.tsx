import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CompareSection } from "./CompareSection";

const push = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/compare",
  useSearchParams: () => searchParams,
}));

function pkgResponse(overrides: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({
      pkg: {
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
      },
    }),
  );
}

describe("CompareSection", () => {
  beforeEach(() => {
    push.mockClear();
    searchParams = new URLSearchParams();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [] }))),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the empty state when no packages are selected", () => {
    render(<CompareSection />);

    expect(screen.getByText("Comparator is empty")).toBeInTheDocument();
  });

  it("loads a preset by pushing pkg params to the URL", async () => {
    const user = userEvent.setup();

    render(<CompareSection />);

    await user.click(screen.getByText("Popular Web Stack"));

    expect(push).toHaveBeenCalledWith(
      "/compare?pkg=github.com%2Fgin-gonic%2Fgin&pkg=gorm.io%2Fgorm",
    );
  });

  it("fetches and shows package info for each ?pkg= param", async () => {
    searchParams = new URLSearchParams("pkg=github.com/gin-gonic/gin");
    vi.mocked(fetch).mockResolvedValue(pkgResponse());

    render(<CompareSection />);

    expect(await screen.findByText("gin")).toBeInTheDocument();
  });

  it("removes a package by pushing the remaining pkg params", async () => {
    searchParams = new URLSearchParams("pkg=github.com/gin-gonic/gin");
    vi.mocked(fetch).mockResolvedValue(pkgResponse());

    const user = userEvent.setup();

    render(<CompareSection />);

    await screen.findByText("gin");

    await user.click(
      screen.getByRole("button", { name: /remove gin from comparison/i }),
    );

    expect(push).toHaveBeenCalledWith("/compare");
  });

  it("adds a package from search suggestions", async () => {
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/api/search")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              results: [
                {
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
                },
              ],
            }),
          ),
        );
      }

      return Promise.resolve(pkgResponse());
    });

    const user = userEvent.setup();

    render(<CompareSection />);

    await user.type(
      screen.getByRole("textbox", { name: /search to add a package/i }),
      "gin",
    );

    await user.click(await screen.findByText("gin"));

    expect(push).toHaveBeenCalledWith(
      "/compare?pkg=github.com%2Fgin-gonic%2Fgin",
    );
  });
});
