import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SearchHistoryDropdown } from "./SearchHistoryDropdown";

describe("SearchHistoryDropdown", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders nothing when there is no history", () => {
    const { container } = render(<SearchHistoryDropdown onSelect={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("lists saved queries", () => {
    localStorage.setItem(
      "gopkg_search_history",
      JSON.stringify(["gin", "echo"]),
    );

    render(<SearchHistoryDropdown onSelect={vi.fn()} />);

    expect(screen.getByText("gin")).toBeInTheDocument();
    expect(screen.getByText("echo")).toBeInTheDocument();
  });

  it("calls onSelect when a history item is picked", async () => {
    localStorage.setItem("gopkg_search_history", JSON.stringify(["gin"]));

    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<SearchHistoryDropdown onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Search for gin" }));

    expect(onSelect).toHaveBeenCalledWith("gin");
  });

  it("removes a single item from history", async () => {
    localStorage.setItem(
      "gopkg_search_history",
      JSON.stringify(["gin", "echo"]),
    );

    const user = userEvent.setup();

    render(<SearchHistoryDropdown onSelect={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: 'Remove "gin" from search history' }),
    );

    expect(screen.queryByText("gin")).not.toBeInTheDocument();
    expect(screen.getByText("echo")).toBeInTheDocument();
  });

  it("renders the lg size variant with its own styling", () => {
    localStorage.setItem("gopkg_search_history", JSON.stringify(["gin"]));

    render(<SearchHistoryDropdown onSelect={vi.fn()} size="lg" />);

    expect(screen.getByText("gin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear all/i })).toHaveClass(
      "hover:underline",
    );
  });

  it("applies a custom className to the container", () => {
    localStorage.setItem("gopkg_search_history", JSON.stringify(["gin"]));

    const { container } = render(
      <SearchHistoryDropdown onSelect={vi.fn()} className="my-custom-class" />,
    );

    expect(container.firstElementChild).toHaveClass("my-custom-class");
  });

  it("clears all history", async () => {
    localStorage.setItem(
      "gopkg_search_history",
      JSON.stringify(["gin", "echo"]),
    );

    const user = userEvent.setup();

    const { container } = render(<SearchHistoryDropdown onSelect={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /clear all/i }));

    expect(container).toBeEmptyDOMElement();
    expect(localStorage.getItem("gopkg_search_history")).toBeNull();
  });
});
