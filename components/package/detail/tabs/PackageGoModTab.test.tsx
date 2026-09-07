import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PackageGoModTab } from "./PackageGoModTab";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

describe("PackageGoModTab", () => {
  it("shows the go.mod content for the given version", () => {
    const { container } = render(
      <PackageGoModTab
        goMod={"module github.com/gin-gonic/gin\n\ngo 1.21"}
        version="v1.9.0"
      />,
    );

    expect(screen.getByText(/go\.mod file for version v1\.9\.0/i)).toBeInTheDocument();
    expect(container.querySelector("code")?.textContent).toContain(
      "module github.com/gin-gonic/gin",
    );
  });

  it("shows a fallback when no go.mod is provided", () => {
    render(<PackageGoModTab goMod={undefined} version="v1.9.0" />);

    expect(screen.getByText(/no go\.mod file provided/i)).toBeInTheDocument();
  });
});
