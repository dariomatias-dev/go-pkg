import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalResults={5}
        perPage={10}
        itemCountInPage={5}
        label="packages"
        onPageChange={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders every page number when there are 7 or fewer pages", () => {
    render(
      <Pagination
        currentPage={1}
        totalResults={70}
        perPage={10}
        itemCountInPage={10}
        label="packages"
        onPageChange={vi.fn()}
      />,
    );

    for (const page of [1, 2, 3, 4, 5, 6, 7]) {
      expect(
        screen.getByRole("button", { name: String(page) }),
      ).toBeInTheDocument();
    }
  });

  it("collapses distant pages into ellipses beyond 7 pages", () => {
    render(
      <Pagination
        currentPage={5}
        totalResults={200}
        perPage={10}
        itemCountInPage={10}
        label="packages"
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
  });

  it("calls onPageChange with the next page", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={2}
        totalResults={100}
        perPage={10}
        itemCountInPage={10}
        label="packages"
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("disables the previous button on the first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalResults={100}
        perPage={10}
        itemCountInPage={10}
        label="packages"
        onPageChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });
});
