import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { GitHubRelease } from "@/lib/github/types";

import { VersionList } from "./VersionList";

function release(overrides: Partial<GitHubRelease> = {}): GitHubRelease {
  return {
    id: 1,
    tag_name: "v1.1.0",
    name: "v1.1.0",
    body: "",
    published_at: "2024-05-01T00:00:00Z",
    html_url: "https://github.com/gin-gonic/gin/releases/tag/v1.1.0",
    prerelease: false,
    draft: false,
    ...overrides,
  };
}

function baseProps() {
  return {
    versions: ["v1.1.0", "v1.0.0"],
    loading: false,
    error: false,
    selected: "v1.1.0",
    latestVersion: "v1.1.0",
    releases: [] as GitHubRelease[],
    releasesLoading: false,
    page: 1,
    totalPages: 1,
    onSelect: vi.fn(),
    onPageChange: vi.fn(),
  };
}

describe("VersionList", () => {
  it("shows a loading indicator", () => {
    const { container } = render(
      <VersionList {...baseProps()} loading={true} versions={[]} />,
    );

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(<VersionList {...baseProps()} error={true} versions={[]} />);

    expect(screen.getByText(/failed to load versions/i)).toBeInTheDocument();
  });

  it("marks the latest version and tags versions with a matching release", () => {
    render(
      <VersionList
        {...baseProps()}
        releases={[release({ tag_name: "v1.0.0" })]}
      />,
    );

    expect(screen.getByText("latest")).toBeInTheDocument();

    const v100Button = screen.getByRole("button", { name: /v1\.0\.0/ });

    expect(v100Button.querySelector("svg")).toBeInTheDocument();
  });

  it("calls onSelect when a version is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<VersionList {...baseProps()} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /v1\.0\.0/ }));

    expect(onSelect).toHaveBeenCalledWith("v1.0.0");
  });

  it("hides pagination controls when there is only one page", () => {
    render(<VersionList {...baseProps()} totalPages={1} />);

    expect(screen.queryByText(/1 \/ 1/)).not.toBeInTheDocument();
  });

  it("navigates pages and disables the edges", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <VersionList
        {...baseProps()}
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    const [prev, next] = screen.getAllByRole("button").slice(-2);

    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();

    await user.click(next);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
