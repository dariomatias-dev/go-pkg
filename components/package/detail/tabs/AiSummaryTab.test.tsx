import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AiSummaryTab } from "./AiSummaryTab";

describe("AiSummaryTab", () => {
  it("shows a loading state", () => {
    render(
      <AiSummaryTab loading={true} error={null} summary="" onRetry={vi.fn()} />,
    );

    expect(
      screen.getByText(/requesting analysis from gopher ai/i),
    ).toBeInTheDocument();
  });

  it("shows an error with a retry action", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <AiSummaryTab
        loading={false}
        error="Failed to generate summary."
        summary=""
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("Failed to generate summary.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(onRetry).toHaveBeenCalled();
  });

  it("renders the summary as markdown", () => {
    render(
      <AiSummaryTab
        loading={false}
        error={null}
        summary="A **fast** HTTP router."
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByText("fast")).toBeInTheDocument();
  });

  it("shows a fallback when there is no summary and no error", () => {
    render(
      <AiSummaryTab loading={false} error={null} summary="" onRetry={vi.fn()} />,
    );

    expect(screen.getByText(/no summary available/i)).toBeInTheDocument();
  });
});
