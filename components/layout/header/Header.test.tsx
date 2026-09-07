import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Header } from "./Header";

const setTheme = vi.fn();
let pathname = "/";

vi.mock("next-themes", () => ({
  useTheme: () => ({ setTheme }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("Header", () => {
  beforeEach(() => {
    localStorage.clear();
    setTheme.mockClear();
    pathname = "/";
  });

  it("opens the menu and shows navigation links", async () => {
    const user = userEvent.setup();

    render(<Header />);

    await user.click(screen.getByRole("button", { name: /menu/i }));

    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /favorites/i }),
    ).toBeInTheDocument();
  });

  it("closes the menu when a nav link is clicked", async () => {
    const user = userEvent.setup();

    render(<Header />);

    await user.click(screen.getByRole("button", { name: /menu/i }));
    await user.click(screen.getByRole("link", { name: /favorites/i }));

    expect(screen.queryByText("Navigation")).not.toBeInTheDocument();
  });

  it("shows a badge with the favorites count", async () => {
    localStorage.setItem(
      "gopkg_favorites",
      JSON.stringify([
        {
          name: "gin",
          importPath: "github.com/gin-gonic/gin",
          description: "",
          stars: 1,
          forks: 0,
          license: "",
          latestVersion: "",
          category: "",
          tags: [],
          author: "",
          publishedAt: "",
        },
      ]),
    );

    const user = userEvent.setup();

    render(<Header />);

    await user.click(screen.getByRole("button", { name: /menu/i }));

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("changes the theme from the theme menu", async () => {
    const user = userEvent.setup();

    render(<Header />);

    await user.click(screen.getByRole("button", { name: /change theme/i }));
    await user.click(screen.getByRole("menuitem", { name: /dark/i }));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
