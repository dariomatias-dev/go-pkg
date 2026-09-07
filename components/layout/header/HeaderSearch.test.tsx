import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HeaderSearch } from "./HeaderSearch";

const push = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}));

describe("HeaderSearch", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    searchParams = new URLSearchParams();
  });

  it("initializes the input from the ?q= URL param", () => {
    searchParams = new URLSearchParams("q=gin");

    render(<HeaderSearch />);

    expect(screen.getByRole("textbox")).toHaveValue("gin");
  });

  it("submits the trimmed query, saves history and navigates", async () => {
    const user = userEvent.setup();

    render(<HeaderSearch />);

    await user.type(screen.getByRole("textbox"), "  gin  {Enter}");

    expect(push).toHaveBeenCalledWith("/search?q=gin");
    expect(localStorage.getItem("gopkg_search_history")).toContain("gin");
  });

  it("does not submit an empty/whitespace-only query", async () => {
    const user = userEvent.setup();

    render(<HeaderSearch />);

    await user.type(screen.getByRole("textbox"), "   {Enter}");

    expect(push).not.toHaveBeenCalled();
  });

  it("clears the input when the clear button is clicked", async () => {
    const user = userEvent.setup();

    render(<HeaderSearch />);

    await user.type(screen.getByRole("textbox"), "gin");
    await user.click(screen.getByRole("button", { name: /clear search/i }));

    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("shows recent searches on focus when history exists", async () => {
    localStorage.setItem("gopkg_search_history", JSON.stringify(["gin"]));

    const user = userEvent.setup();

    render(<HeaderSearch />);

    await user.click(screen.getByRole("textbox"));

    expect(screen.getByText(/recent searches/i)).toBeInTheDocument();
  });
});
