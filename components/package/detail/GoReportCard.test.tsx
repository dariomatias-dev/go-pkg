import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";

import { GoReportCard } from "./GoReportCard";

function renderCard(importPath: string) {
  return render(
    <TooltipProvider>
      <GoReportCard importPath={importPath} />
    </TooltipProvider>,
  );
}

describe("GoReportCard", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading skeleton before the report resolves", () => {
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}));

    const { container } = renderCard("github.com/gin-gonic/gin");

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders nothing when the report is unavailable", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }));

    const { container } = renderCard("github.com/gin-gonic/gin");

    await waitFor(() =>
      expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument(),
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the grade and links to the full report", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          grade: "A+",
          reportUrl: "https://goreportcard.com/report/github.com/gin-gonic/gin",
        }),
      ),
    );

    renderCard("github.com/gin-gonic/gin");

    expect(await screen.findByText("A+")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view full report/i }),
    ).toHaveAttribute(
      "href",
      "https://goreportcard.com/report/github.com/gin-gonic/gin",
    );
  });

  it("falls back to the F style and a generic tooltip for an unrecognized grade", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          grade: "X",
          reportUrl: "https://goreportcard.com/report/github.com/gin-gonic/gin",
        }),
      ),
    );

    renderCard("github.com/gin-gonic/gin");

    const grade = await screen.findByText("X");

    expect(grade.className).toContain("text-rose-600");
  });

  it("renders nothing when the fetch itself fails", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));

    const { container } = renderCard("github.com/gin-gonic/gin");

    await waitFor(() =>
      expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument(),
    );
    expect(container).toBeEmptyDOMElement();
  });
});
