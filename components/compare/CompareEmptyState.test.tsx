import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CompareEmptyState } from "./CompareEmptyState";

describe("CompareEmptyState", () => {
  it("renders every preset", () => {
    render(<CompareEmptyState onPreset={vi.fn()} />);

    expect(screen.getByText("Popular Web Stack")).toBeInTheDocument();
    expect(screen.getByText("Robust CLI")).toBeInTheDocument();
    expect(screen.getByText("Telemetry & Logging")).toBeInTheDocument();
  });

  it("calls onPreset with the preset's package names", async () => {
    const user = userEvent.setup();
    const onPreset = vi.fn();

    render(<CompareEmptyState onPreset={onPreset} />);

    await user.click(screen.getByText("Popular Web Stack"));

    expect(onPreset).toHaveBeenCalledWith(["gin", "gorm"]);
  });
});
