import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { RecentPackages } from "./RecentPackages";

describe("RecentPackages", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders nothing when there is no history", () => {
    const { container } = render(<RecentPackages />);

    expect(container).toBeEmptyDOMElement();
  });

  it("lists visited packages, linking to their detail page", () => {
    localStorage.setItem(
      "gopkg_package_history",
      JSON.stringify(["github.com/gin-gonic/gin"]),
    );

    render(<RecentPackages />);

    expect(screen.getByText("gin")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /gin github.com\/gin-gonic\/gin/i }),
    ).toHaveAttribute("href", "/package/github.com/gin-gonic/gin");
  });

  it("removes a single entry", async () => {
    localStorage.setItem(
      "gopkg_package_history",
      JSON.stringify(["github.com/gin-gonic/gin", "github.com/labstack/echo"]),
    );

    const user = userEvent.setup();

    render(<RecentPackages />);

    await user.click(
      screen.getByRole("button", { name: /remove gin from recently visited/i }),
    );

    expect(screen.queryByText("gin")).not.toBeInTheDocument();
    expect(screen.getByText("echo")).toBeInTheDocument();
  });

  it("clears all history", async () => {
    localStorage.setItem(
      "gopkg_package_history",
      JSON.stringify(["github.com/gin-gonic/gin"]),
    );

    const user = userEvent.setup();

    const { container } = render(<RecentPackages />);

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(container).toBeEmptyDOMElement();
  });
});
