import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchToolbar } from "./SearchToolbar";

describe("SearchToolbar", () => {
  it("shows a loading message while searching", () => {
    render(
      <SearchToolbar
        totalResults={0}
        loading={true}
        sort="stars"
        perPage={10}
        onSortChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/searching packages in the index/i),
    ).toBeInTheDocument();
  });

  it("shows the result count when not loading", () => {
    render(
      <SearchToolbar
        totalResults={42}
        loading={false}
        sort="stars"
        perPage={10}
        onSortChange={vi.fn()}
        onPerPageChange={vi.fn()}
      />,
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText(/matching results/i)).toBeInTheDocument();
  });

  it("calls onSortChange when a sort option is picked", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    render(
      <SearchToolbar
        totalResults={5}
        loading={false}
        sort="stars"
        perPage={10}
        onSortChange={onSortChange}
        onPerPageChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /stars/i }));
    await user.click(
      screen.getByRole("menuitemradio", { name: /recently updated/i }),
    );

    expect(onSortChange).toHaveBeenCalledWith("updated");
  });

  it("calls onPerPageChange when a per-page option is picked", async () => {
    const user = userEvent.setup();
    const onPerPageChange = vi.fn();

    render(
      <SearchToolbar
        totalResults={5}
        loading={false}
        sort="stars"
        perPage={10}
        onSortChange={vi.fn()}
        onPerPageChange={onPerPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "10" }));
    await user.click(screen.getByRole("menuitemradio", { name: "50" }));

    expect(onPerPageChange).toHaveBeenCalledWith(50);
  });
});
