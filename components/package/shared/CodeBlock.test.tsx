import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CodeBlock } from "./CodeBlock";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

describe("CodeBlock", () => {
  it("renders the trimmed code", () => {
    render(<CodeBlock code={"\n  go get example.com/pkg\n"} />);

    expect(screen.getByText("go get example.com/pkg")).toBeInTheDocument();
  });

  it("copies the code and shows a checkmark that reverts", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    render(<CodeBlock code="go get example.com/pkg" />);

    await user.click(screen.getByTitle("Copy code"));

    expect(writeText).toHaveBeenCalledWith("go get example.com/pkg");

    await waitFor(() =>
      expect(document.querySelector(".lucide-check")).toBeInTheDocument(),
    );
    await waitFor(
      () => expect(document.querySelector(".lucide-copy")).toBeInTheDocument(),
      { timeout: 3000 },
    );
  });
});
