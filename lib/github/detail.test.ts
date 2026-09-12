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

  it("keeps default version when the version-list fetch throws a network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes("@v/list") || url.includes("@latest")) {
          return Promise.reject(new Error("network down"));
        }

        return Promise.resolve(new Response(null, { status: 404 }));
      }),
    );

    const result = await getPackageDetail("github.com/gin-gonic/gin");

    expect(result.pkg.latestVersion).toBe("v0.0.0");
  });

  it("keeps default repo values when the GitHub repo fetch throws a network error", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () => new Response("", { status: 404 }),
        "api.github.com/repos": () => {
          throw new Error("network down");
        },
      }),
    );

    const result = await getPackageDetail("github.com/gin-gonic/gin");

    expect(result.pkg.stars).toBe(0);
    expect(result.pkg.githubUrl).toBeUndefined();
  });

  it("keeps default version and publish date when @latest omits Version and Time", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () => new Response(JSON.stringify({})),
      }),
    );

    const result = await getPackageDetail("example.com/owner/repo");

    expect(result.pkg.latestVersion).toBe("v0.0.0");
    expect(result.pkg.publishedAt).toBe("Unknown");
  });

  it("skips the go.mod lookup when @latest resolves to an empty version", async () => {
    const fetchMock = mockFetchByUrl({
      "@v/list": () => new Response("", { status: 404 }),
      "@latest": () => new Response(JSON.stringify({ Version: "" })),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getPackageDetail("example.com/owner/repo");

    expect(result.pkg.latestVersion).toBe("");
    expect(result.pkg.dependenciesCount).toBe(0);
    expect(fetchMock.mock.calls.some(([u]) => String(u).includes(".mod"))).toBe(
      false,
    );
  });

  it("falls back to go-community and a placeholder README for a path with no GitHub-resolvable repo", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () => new Response("", { status: 404 }),
      }),
    );

    const result = await getPackageDetail("onlyname");

    expect(result.pkg.author).toBe("go-community");
    expect(result.pkg.githubUrl).toBeUndefined();
    expect(result.pkg.readme).toContain("No README was found automatically");
  });

  it("uses the import path itself as the package name when it ends in a slash", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () => new Response("", { status: 404 }),
      }),
    );

    const result = await getPackageDetail("github.com/owner/");

    expect(result.pkg.name).toBe("github.com/owner/");
  });

  it("falls back to the license name when spdx_id is absent, and keeps other defaults when their fields are missing", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () => new Response("", { status: 404 }),
        "api.github.com/repos": () =>
          new Response(
            JSON.stringify({ license: { name: "Apache License 2.0" } }),
          ),
      }),
    );

    const result = await getPackageDetail("github.com/gin-gonic/gin");

    expect(result.pkg.license).toBe("Apache License 2.0");
    expect(result.pkg.stars).toBe(0);
    expect(result.pkg.forks).toBe(0);
    expect(result.pkg.description).toBe("Go package discovered on demand.");
    expect(result.pkg.publishedAt).toBe("Unknown");
  });

  it("keeps the default license label when the GitHub repo has no license at all", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchByUrl({
        "@v/list": () => new Response("", { status: 404 }),
        "@latest": () => new Response("", { status: 404 }),
        "api.github.com/repos": () => new Response(JSON.stringify({})),
      }),
    );

    const result = await getPackageDetail("github.com/gin-gonic/gin");

    expect(result.pkg.license).toBe("View on GitHub");
  });
});
