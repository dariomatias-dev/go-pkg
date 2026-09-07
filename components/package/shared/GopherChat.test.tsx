import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GopherChat } from "./GopherChat";

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GopherChat", () => {
  it("greets with the package's import path and shows quick questions", () => {
    render(<GopherChat importPath="github.com/gin-gonic/gin" />);

    expect(
      screen.getByRole("heading", { name: /gopher ai assistant/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/how to import and use\?/i),
    ).toBeInTheDocument();
  });

  it("collapses and expands the panel", async () => {
    const user = userEvent.setup();

    render(<GopherChat importPath="github.com/gin-gonic/gin" />);

    const toggle = screen.getByRole("button", { expanded: true });

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("textbox", { name: /ask about this package/i }),
    ).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  it("fills the input when a quick question is picked", async () => {
    const user = userEvent.setup();

    render(<GopherChat importPath="github.com/gin-gonic/gin" />);

    await user.click(screen.getByText(/simple code example/i));

    expect(
      screen.getByRole("textbox", { name: /ask about this package/i }),
    ).toHaveValue("Simple code example");
  });

  it("disables send until there is input, and clears via the X button", async () => {
    const user = userEvent.setup();

    render(<GopherChat importPath="github.com/gin-gonic/gin" />);

    const sendButton = screen.getByRole("button", { name: /send message/i });
    const input = screen.getByRole("textbox", {
      name: /ask about this package/i,
    });

    expect(sendButton).toBeDisabled();

    await user.type(input, "hello");
    expect(sendButton).toBeEnabled();

    await user.click(screen.getByTitle("Clear"));
    expect(input).toHaveValue("");
    expect(sendButton).toBeDisabled();
  });

  it("sends a message and renders the assistant's reply", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ text: "Use `go get` to install it." })),
    );

    const user = userEvent.setup();

    render(<GopherChat importPath="github.com/gin-gonic/gin" />);

    await user.type(
      screen.getByRole("textbox", { name: /ask about this package/i }),
      "How do I install it?",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText("How do I install it?")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText(/to install it\./i)).toBeInTheDocument(),
    );

    const [, body] = vi.mocked(fetch).mock.calls[0];
    const payload = JSON.parse(body!.body as string);

    expect(payload.importPath).toBe("github.com/gin-gonic/gin");
    expect(payload.message).toBe("How do I install it?");
  });

  it("shows a fallback message when the API responds with an error", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "boom" } }), {
        status: 500,
      }),
    );

    const user = userEvent.setup();

    render(<GopherChat importPath="github.com/gin-gonic/gin" />);

    await user.type(
      screen.getByRole("textbox", { name: /ask about this package/i }),
      "hi",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/an error occurred/i),
    ).toBeInTheDocument();
  });

  it("shows a network-failure message when the fetch rejects", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));

    const user = userEvent.setup();

    render(<GopherChat importPath="github.com/gin-gonic/gin" />);

    await user.type(
      screen.getByRole("textbox", { name: /ask about this package/i }),
      "hi",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/no response from server/i),
    ).toBeInTheDocument();
  });

  it("resets the conversation when the import path changes", () => {
    const { rerender } = render(
      <GopherChat importPath="github.com/gin-gonic/gin" />,
    );

    expect(screen.getByText(/gin-gonic\/gin/)).toBeInTheDocument();

    rerender(<GopherChat importPath="github.com/labstack/echo" />);

    expect(screen.getByText(/labstack\/echo/)).toBeInTheDocument();
    expect(screen.queryByText(/gin-gonic\/gin/)).not.toBeInTheDocument();
  });
});
