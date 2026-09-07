import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MarkdownRenderer } from "./MarkdownRenderer";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

describe("MarkdownRenderer XSS sanitization", () => {
  it("strips <script> tags from untrusted README HTML", () => {
    const { container } = render(
      <MarkdownRenderer
        content={'Hello<script>alert("xss")</script>World'}
        useRehypeRaw
      />,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).not.toContain("<script>");
  });

  it("strips event handler attributes like onerror", () => {
    const { container } = render(
      <MarkdownRenderer
        content={'<img src="x" onerror="alert(1)">'}
        useRehypeRaw
      />,
    );

    const img = container.querySelector("img");
    expect(img?.getAttribute("onerror")).toBeNull();
  });

  it("still renders safe raw HTML tags", () => {
    const { container } = render(
      <MarkdownRenderer content={"<strong>bold</strong> text"} useRehypeRaw />,
    );

    expect(container.querySelector("strong")).not.toBeNull();
  });

  it("does not process raw HTML when useRehypeRaw is false (default)", () => {
    const { container } = render(
      <MarkdownRenderer content={"<strong>bold</strong> text"} />,
    );

    expect(container.querySelector("strong")).toBeNull();
  });
});

describe("MarkdownRenderer component overrides", () => {
  it("gives headings a slugified id and an anchor link", () => {
    const { container } = render(
      <MarkdownRenderer content={"## Getting Started!"} />,
    );

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toHaveAttribute("id", "getting-started");
    expect(
      container.querySelector('a[href="#getting-started"]'),
    ).not.toBeNull();
  });

  it("renders a fenced code block via the code-split CodeBlock", async () => {
    const { container } = render(
      <MarkdownRenderer content={"```go\nfmt.Println(1)\n```"} />,
    );

    await waitFor(() =>
      expect(container.querySelector("code")?.textContent).toBe(
        "fmt.Println(1)",
      ),
    );
    expect(screen.getByTitle("Copy code")).toBeInTheDocument();
  });

  it("renders inline code without the CodeBlock", () => {
    const { container } = render(<MarkdownRenderer content="Use `go get`." />);

    expect(container.querySelector("code")?.textContent).toBe("go get");
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("opens external links in a new tab but keeps anchor links in-page", () => {
    render(
      <MarkdownRenderer
        content={"[ext](https://example.com) and [jump](#section)"}
      />,
    );

    expect(screen.getByRole("link", { name: "ext" })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: "jump" })).not.toHaveAttribute(
      "target",
    );
  });

  it("renders GFM tables with header and body cells", () => {
    render(
      <MarkdownRenderer content={"| A | B |\n| --- | --- |\n| 1 | 2 |"} />,
    );

    expect(screen.getByRole("columnheader", { name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "1" })).toBeInTheDocument();
  });

  it("renders a details/summary disclosure with content separated from the summary", () => {
    const { container } = render(
      <MarkdownRenderer
        content={
          "<details><summary>More</summary>\n\nHidden text\n\n</details>"
        }
        useRehypeRaw
      />,
    );

    expect(screen.getByText("More")).toBeInTheDocument();
    expect(container.querySelector("details > div")?.textContent).toContain(
      "Hidden text",
    );
  });

  it("renders emoji shortcodes via remark-emoji", () => {
    const { container } = render(<MarkdownRenderer content=":rocket:" />);

    expect(container.textContent).toContain("🚀");
  });
});
