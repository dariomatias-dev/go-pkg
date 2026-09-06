import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPackageDetail } from "./detail";

function mockFetchByUrl(handlers: Record<string, () => Response>) {
  return vi.fn((input: RequestInfo | URL) => {
    const url = String(input);

    for (const [pattern, handler] of Object.entries(handlers)) {
      if (url.includes(pattern)) return Promise.resolve(handler());
    }

    return Promise.resolve(new Response(null, { status: 404 }));
  });
}

describe("getPackageDetail", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("assembles a full package detail from the proxy, GitHub and README", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("v1.0.0\nv1.1.0\n"),
        "@v/v1.1.0.mod": () => new Response("require github.com/a/b v1.0.0\n"),
        "api.github.com/repos": () =>
          new Response(
            JSON.stringify({
              stargazers_count: 42,
              forks_count: 7,
              license: { spdx_id: "MIT", name: "MIT License" },
              description: "A great package",
              updated_at: "2024-05-01T00:00:00Z",
            }),
          ),
        "raw.githubusercontent.com": () => new Response("# hello"),
      }),
    );

    const result = await getPackageDetail("github.com/gin-gonic/gin");

    expect(result.pkg.latestVersion).toBe("v1.1.0");
    expect(result.pkg.versions).toEqual(["v1.1.0", "v1.0.0"]);
    expect(result.pkg.stars).toBe(42);
    expect(result.pkg.forks).toBe(7);
    expect(result.pkg.license).toBe("MIT");
    expect(result.pkg.description).toBe("A great package");
    expect(result.pkg.readme).toBe("# hello");
    expect(result.pkg.dependenciesCount).toBe(1);
    expect(result.isCustom).toBe(true);
  });

  it("falls back to @latest when the version list is empty", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () =>
          new Response(
            JSON.stringify({ Version: "v2.0.0", Time: "2024-01-01T00:00:00Z" }),
          ),
      }),
    );

    const result = await getPackageDetail("example.com/owner/repo");

    expect(result.pkg.latestVersion).toBe("v2.0.0");
    expect(result.pkg.publishedAt).toBe("2024-01-01");
  });

  it("provides a placeholder README when none is found on any branch", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () => new Response("", { status: 404 }),
      }),
    );

    const result = await getPackageDetail("github.com/gin-gonic/gin");

    expect(result.pkg.readme).toContain("No README was found automatically");
  });

  it("keeps default values when the GitHub repo lookup fails", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () => new Response("", { status: 404 }),
        "api.github.com/repos": () => new Response(null, { status: 500 }),
      }),
    );

    const result = await getPackageDetail("github.com/gin-gonic/gin");

    expect(result.pkg.stars).toBe(0);
    expect(result.pkg.forks).toBe(0);
  });
});
