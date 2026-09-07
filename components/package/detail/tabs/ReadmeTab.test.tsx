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
});
