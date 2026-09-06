import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownRenderer } from "./MarkdownRenderer";

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
