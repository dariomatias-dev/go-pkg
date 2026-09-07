import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PackageBreadcrumb } from "./PackageBreadcrumb";

describe("PackageBreadcrumb", () => {
  it("links to home and packages, and shows the import path", () => {
    render(<PackageBreadcrumb importPath="github.com/gin-gonic/gin" />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Packages" })).toHaveAttribute(
      "href",
      "/search",
    );
    expect(screen.getByText("github.com/gin-gonic/gin")).toBeInTheDocument();
  });
});
