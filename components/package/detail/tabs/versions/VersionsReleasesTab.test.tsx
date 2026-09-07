import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VersionsReleasesTab } from "./VersionsReleasesTab";

const replace = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/package/github.com/gin-gonic/gin",
  useSearchParams: () => searchParams,
}));

function versionsResponse(overrides: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({
      versions: ["v1.1.0", "v1.0.0"],
      total: 2,
      page: 1,
      totalPages: 1,
      ...overrides,
    }),
  );
}

function releasesResponse(overrides: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({
      releases: [
        {
          id: 1,
          tag_name: "v1.1.0",
          name: "v1.1.0",
          body: "Release notes",
          published_at: "2024-05-01T00:00:00Z",
          html_url: "https://github.com/gin-gonic/gin/releases/tag/v1.1.0",
          prerelease: false,
          draft: false,
        },
      ],
      ...overrides,
    }),
  );
}

function mockFetch(
  versions = versionsResponse(),
  releases = releasesResponse(),
) {
  vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("package-versions")) return Promise.resolve(versions);
    if (url.includes("package-releases")) return Promise.resolve(releases);

    return Promise.reject(new Error(`unexpected fetch: ${url}`));
  });
}

describe("VersionsReleasesTab", () => {
  beforeEach(() => {
    replace.mockClear();
    searchParams = new URLSearchParams();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads versions and releases, preselecting the latest version", async () => {
    mockFetch();

    render(
      <VersionsReleasesTab
        importPath="github.com/gin-gonic/gin"
        latestVersion="v1.1.0"
      />,
    );

    expect(await screen.findByText("v1.0.0")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText("Release notes")).toBeInTheDocument(),
    );
  });

  it("preselects the version from the ?version= URL param", async () => {
    searchParams = new URLSearchParams("version=v1.0.0");
    mockFetch();

    render(
      <VersionsReleasesTab
        importPath="github.com/gin-gonic/gin"
        latestVersion="v1.1.0"
      />,
    );

    await screen.findByRole("button", { name: /v1\.0\.0/ });

    expect(
      screen.getByText(/no release notes for/i),
    ).toBeInTheDocument();
  });

  it("clears the URL's version param when the selected version has no release", async () => {
    mockFetch();

    const user = userEvent.setup();

    render(
      <VersionsReleasesTab
        importPath="github.com/gin-gonic/gin"
        latestVersion="v1.1.0"
      />,
    );

    await screen.findByText("Release notes");

    await user.click(screen.getByRole("button", { name: /v1\.0\.0/ }));

    expect(replace).toHaveBeenCalledWith(
      "/package/github.com/gin-gonic/gin",
      { scroll: false },
    );
  });

  it("sets the URL's version param when the selected version has a release", async () => {
    mockFetch(
      versionsResponse(),
      releasesResponse({
        releases: [
          {
            id: 1,
            tag_name: "v1.1.0",
            name: "v1.1.0",
            body: "Release notes",
            published_at: "2024-05-01T00:00:00Z",
            html_url: "https://github.com/gin-gonic/gin/releases/tag/v1.1.0",
            prerelease: false,
            draft: false,
          },
          {
            id: 2,
            tag_name: "v1.0.0",
            name: "v1.0.0",
            body: "Older notes",
            published_at: "2024-01-01T00:00:00Z",
            html_url: "https://github.com/gin-gonic/gin/releases/tag/v1.0.0",
            prerelease: false,
            draft: false,
          },
        ],
      }),
    );

    const user = userEvent.setup();

    render(
      <VersionsReleasesTab
        importPath="github.com/gin-gonic/gin"
        latestVersion="v1.1.0"
      />,
    );

    await screen.findByText("Release notes");

    await user.click(screen.getByRole("button", { name: /v1\.0\.0/ }));

    expect(replace).toHaveBeenCalledWith(
      "/package/github.com/gin-gonic/gin?version=v1.0.0",
      { scroll: false },
    );
  });

  it("shows an error state when the versions fetch fails", async () => {
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("package-versions")) return Promise.reject(new Error("boom"));

      return Promise.resolve(releasesResponse());
    });

    render(
      <VersionsReleasesTab
        importPath="github.com/gin-gonic/gin"
        latestVersion="v1.1.0"
      />,
    );

    expect(await screen.findByText(/failed to load versions/i)).toBeInTheDocument();
  });
});
