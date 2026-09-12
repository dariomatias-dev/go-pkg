import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReadmeTab } from "./ReadmeTab";

describe("ReadmeTab", () => {
  it("shows a fallback when there is no README", () => {
    render(<ReadmeTab readme="" />);

    expect(
      screen.getByText(/no readme or documentation provided/i),
    ).toBeInTheDocument();
  });

  it("renders README markdown content", () => {
    render(<ReadmeTab readme={"# Gin\n\nA **fast** web framework."} />);

    expect(screen.getByRole("heading", { name: "Gin" })).toBeInTheDocument();
    expect(screen.getByText("fast")).toBeInTheDocument();
  });

  it("opens external links in a new tab", () => {
    render(<ReadmeTab readme="[docs](https://pkg.go.dev/gin)" />);

    expect(screen.getByRole("link", { name: "docs" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("does not open in-page anchor links in a new tab", () => {
    render(<ReadmeTab readme="[jump](#section)" />);

    const link = screen.getByRole("link", { name: "jump" });

    expect(link).not.toHaveAttribute("target");
  });

  it("embeds a YouTube player for a YouTube link", () => {
    render(
      <ReadmeTab readme="[demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)" />,
    );

    expect(screen.getByTitle("YouTube video player")).toBeInTheDocument();
    expect(screen.getByText(/watch on youtube/i)).toBeInTheDocument();
  });

  it("keeps a root-relative image path as-is when there is no GitHub repo", () => {
    render(<ReadmeTab readme="![logo](/assets/logo.png)" />);

    expect(screen.getByAltText("logo")).toHaveAttribute(
      "src",
      expect.stringContaining("assets%2Flogo.png"),
    );
  });

  it("renders nothing for an image with no src", () => {
    const { container } = render(<ReadmeTab readme="![broken]()" />);

    expect(container.querySelector("img")).toBeNull();
  });

  it("renders a shields.io badge at a smaller, inline size", () => {
    render(
      <ReadmeTab readme="![build](https://img.shields.io/badge/build-passing-green)" />,
    );

    const img = screen.getByAltText("build");

    expect(img).toHaveAttribute("width", "120");
    expect(img).toHaveAttribute("height", "20");
  });

  it("resolves relative image paths against the GitHub repo", () => {
    render(
      <ReadmeTab
        readme="![logo](./assets/logo.png)"
        githubUrl="https://github.com/gin-gonic/gin"
      />,
    );

    expect(screen.getByAltText("logo")).toHaveAttribute(
      "src",
      expect.stringContaining(
        "raw.githubusercontent.com%2Fgin-gonic%2Fgin%2Fmaster%2Fassets%2Flogo.png",
      ),
    );
  });

  it("resolves a relative image path with no leading ./ the same way", () => {
    render(
      <ReadmeTab
        readme="![logo](assets/logo.png)"
        githubUrl="https://github.com/gin-gonic/gin"
      />,
    );

    expect(screen.getByAltText("logo")).toHaveAttribute(
      "src",
      expect.stringContaining(
        "raw.githubusercontent.com%2Fgin-gonic%2Fgin%2Fmaster%2Fassets%2Flogo.png",
      ),
    );
  });

  it("recognizes an .svg image as a badge even without the word badge or shield", () => {
    render(<ReadmeTab readme="![ci](https://example.com/status.svg)" />);

    const img = screen.getByAltText("ci");

    expect(img).toHaveAttribute("width", "120");
    expect(img).toHaveAttribute("height", "20");
  });

  it("drops a raw <img> tag that has no src attribute at all", () => {
    const { container } = render(<ReadmeTab readme='<img alt="broken">' />);

    expect(container.querySelector("img")).toBeNull();
  });

  it("drops a link with an empty href", () => {
    const { container } = render(<ReadmeTab readme="[text]()" />);

    expect(container.querySelector("a")).toBeNull();
  });

  it("falls back to a default alt text for a badge with none", () => {
    render(
      <ReadmeTab readme="![](https://img.shields.io/badge/build-passing-green)" />,
    );

    expect(screen.getByAltText("badge")).toBeInTheDocument();
  });

  it("falls back to a default alt text for a regular image with none", () => {
    render(<ReadmeTab readme="![](/assets/logo.png)" />);

    expect(screen.getByAltText("image")).toBeInTheDocument();
  });

  it("does not turn a YouTube link inside a list item into an embedded player", () => {
    render(
      <ReadmeTab readme="- [demo](https://www.youtube.com/watch?v=dQw4w9WgXcQ)" />,
    );

    expect(screen.queryByTitle("YouTube video player")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "demo" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });
});
