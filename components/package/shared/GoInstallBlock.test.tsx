import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/common/Tooltip";

import { GoInstallBlock } from "./GoInstallBlock";

function renderWithProvider(importPath: string) {
  return render(
    <TooltipProvider>
      <GoInstallBlock importPath={importPath} />
    </TooltipProvider>,
  );
}

describe("GoInstallBlock", () => {
  it("renders the go get command, stripping a major version suffix", () => {
    renderWithProvider("github.com/gin-gonic/gin/v2");

    expect(
      screen.getByText("go get github.com/gin-gonic/gin"),
    ).toBeInTheDocument();
  });

  it("copies the install command and shows Copied feedback that reverts", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    renderWithProvider("github.com/gin-gonic/gin");

    await user.click(screen.getByRole("button", { name: /copy install/i }));

    expect(writeText).toHaveBeenCalledWith("go get github.com/gin-gonic/gin");
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();

    await waitFor(
      () =>
        expect(
          screen.getByRole("button", { name: /copy install/i }),
        ).toBeInTheDocument(),
      { timeout: 3000 },
    );
  });
});
