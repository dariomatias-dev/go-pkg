import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { GitHubRelease } from "@/lib/github/types";

import { ReleaseDetail } from "./ReleaseDetail";

function release(overrides: Partial<GitHubRelease> = {}): GitHubRelease {
  return {
    id: 1,
    tag_name: "v1.1.0",
    name: "v1.1.0",
    body: "## Changes\n\nFixed bugs.",
    published_at: "2024-05-01T00:00:00Z",
    html_url: "https://github.com/gin-gonic/gin/releases/tag/v1.1.0",
    prerelease: false,
    draft: false,
    ...overrides,
  };
}

describe("ReleaseDetail", () => {
  it("shows a loading state", () => {
    render(
      <ReleaseDetail
        loading={true}
        error={false}
        selected="v1.1.0"
        release={undefined}
      />,
    );

    expect(screen.getByText(/loading releases/i)).toBeInTheDocument();
  });

  it("shows an error state", () => {
    render(
      <ReleaseDetail
        loading={false}
        error={true}
        selected="v1.1.0"
        release={undefined}
      />,
    );

    expect(screen.getByText(/failed to load releases/i)).toBeInTheDocument();
  });

  it("prompts to select a version when nothing is selected", () => {
    render(
      <ReleaseDetail
        loading={false}
        error={false}
        selected=""
        release={undefined}
      />,
    );

    expect(screen.getByText(/select a version/i)).toBeInTheDocument();
  });

  it("shows a fallback when the selected version has no matching release", () => {
    render(
      <ReleaseDetail
        loading={false}
        error={false}
        selected="v0.9.0"
        release={undefined}
      />,
    );

    expect(screen.getByText(/no release notes for/i)).toBeInTheDocument();
    expect(screen.getByText("v0.9.0")).toBeInTheDocument();
  });

  it("renders release details with a GitHub link and body markdown", () => {
    render(
      <ReleaseDetail
        loading={false}
        error={false}
        selected="v1.1.0"
        release={release()}
      />,
    );

    expect(screen.getByText("v1.1.0")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view on github/i }),
    ).toHaveAttribute("href", release().html_url);
    expect(screen.getByText("Changes")).toBeInTheDocument();
  });

  it("renders an image in the release body via next/image", () => {
    const { container } = render(
      <ReleaseDetail
        loading={false}
        error={false}
        selected="v1.1.0"
        release={release({
          body: '<img src="https://example.com/shot.png" alt="Screenshot">',
        })}
      />,
    );

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("alt", "Screenshot");
  });

  it("drops an image tag with no src instead of rendering a broken image", () => {
    const { container } = render(
      <ReleaseDetail
        loading={false}
        error={false}
        selected="v1.1.0"
        release={release({ body: '<img alt="Screenshot">' })}
      />,
    );

    expect(container.querySelector("img")).toBeNull();
  });

  it("marks pre-releases and shows a no-notes fallback for an empty body", () => {
    render(
      <ReleaseDetail
        loading={false}
        error={false}
        selected="v1.1.0"
        release={release({ body: "", prerelease: true })}
      />,
    );

    expect(screen.getByText(/pre-release/i)).toBeInTheDocument();
    expect(screen.getByText(/no release notes provided/i)).toBeInTheDocument();
  });
});
