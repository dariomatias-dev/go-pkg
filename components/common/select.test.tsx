import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./select";

const options = [
  { value: "stars", label: "Most stars" },
  { value: "recent", label: "Most recent" },
];

describe("Select", () => {
  it("shows the matching option's label when value matches an option", () => {
    render(<Select value="stars" options={options} onChange={vi.fn()} />);

    expect(screen.getByText("Most stars")).toBeInTheDocument();
  });

  it("falls back to the placeholder when value matches no option", () => {
    render(
      <Select
        value="unknown"
        options={options}
        onChange={vi.fn()}
        placeholder="Sort by"
      />,
    );

    expect(screen.getByText("Sort by")).toBeInTheDocument();
  });

  it("falls back to the raw value when value matches no option and there is no placeholder", () => {
    render(<Select value="unknown" options={options} onChange={vi.fn()} />);

    expect(screen.getByText("unknown")).toBeInTheDocument();
  });

  it("opens the option list and calls onChange when an option is picked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Select value="stars" options={options} onChange={onChange} />);

    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByText("Most recent"));

    expect(onChange).toHaveBeenCalledWith("recent");
  });
});
