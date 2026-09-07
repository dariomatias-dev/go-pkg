import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { GoPackage } from "@/types";

import { COMPARE_ROWS } from "./compareRows";

function pkg(overrides: Partial<GoPackage> = {}): GoPackage {
  return {
    name: "gin",
    importPath: "github.com/gin-gonic/gin",
    description: "A web framework",
    stars: 1234,
    forks: 10,
    license: "MIT",
    latestVersion: "v1.9.0",
    category: "web",
    tags: ["web"],
    author: "gin-gonic",
    publishedAt: "2024-01-01",
    ...overrides,
  };
}

function findRow(label: string) {
  const row = COMPARE_ROWS.find((r) => r.label === label);

  if (!row) throw new Error(`No row named ${label}`);

  return row;
}

describe("COMPARE_ROWS", () => {
  it("formats GitHub stars with a thousands separator", () => {
    render(<>{findRow("GitHub Stars").render(pkg({ stars: 1234 }))}</>);

    expect(screen.getByText((1234).toLocaleString())).toBeInTheDocument();
  });

  it("falls back to 0 forks when missing", () => {
    render(<>{findRow("Forks").render(pkg({ forks: undefined as never }))}</>);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows N/A when importsCount is not provided", () => {
    render(<>{findRow("Imported By").render(pkg())}</>);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("formats importsCount when provided", () => {
    render(<>{findRow("Imported By").render(pkg({ importsCount: 5000 }))}</>);

    expect(screen.getByText(`${(5000).toLocaleString()}`)).toBeInTheDocument();
  });

  it("defaults dependenciesCount to 0", () => {
    render(<>{findRow("Direct Dependencies").render(pkg())}</>);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders the package category, license and maintainer", () => {
    render(<>{findRow("Category").render(pkg({ category: "cli" }))}</>);
    expect(screen.getByText("cli")).toBeInTheDocument();

    render(<>{findRow("License").render(pkg({ license: "Apache-2.0" }))}</>);
    expect(screen.getByText("Apache-2.0")).toBeInTheDocument();

    render(<>{findRow("Maintainer").render(pkg({ author: "spf13" }))}</>);
    expect(screen.getByText("spf13")).toBeInTheDocument();
  });
});
