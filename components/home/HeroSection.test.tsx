import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HeroSection } from "./HeroSection";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("HeroSection", () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
  });

  it("submits the query on Enter and saves it to history", async () => {
    const user = userEvent.setup();

    render(<HeroSection />);

    await user.type(
      screen.getByRole("textbox", { name: /search by package path/i }),
      "gin{Enter}",
    );

    expect(push).toHaveBeenCalledWith("/search?q=gin");
    expect(localStorage.getItem("gopkg_search_history")).toContain("gin");
  });

  it("submits the query when the Search button is clicked", async () => {
    const user = userEvent.setup();

    render(<HeroSection />);

    await user.type(
      screen.getByRole("textbox", { name: /search by package path/i }),
      "cobra",
    );
    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(push).toHaveBeenCalledWith("/search?q=cobra");
  });

  it("does not submit an empty query", async () => {
    const user = userEvent.setup();

    render(<HeroSection />);

    await user.click(screen.getByRole("button", { name: /^search$/i }));

    expect(push).not.toHaveBeenCalled();
  });

  it("submits when a suggestion chip is clicked", async () => {
    const user = userEvent.setup();

    render(<HeroSection />);

    await user.click(screen.getByRole("button", { name: "zap" }));

    expect(push).toHaveBeenCalledWith("/search?q=zap");
  });

  it("clears the query", async () => {
    const user = userEvent.setup();

    const { container } = render(<HeroSection />);

    const input = screen.getByRole("textbox", {
      name: /search by package path/i,
    });

    await user.type(input, "gin");

    const clearButton = Array.from(
      container.querySelectorAll("button"),
    ).find((btn) => btn.textContent === "");

    await user.click(clearButton!);

    expect(input).toHaveValue("");
  });
});
