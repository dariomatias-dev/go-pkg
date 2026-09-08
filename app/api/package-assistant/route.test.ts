import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resetRateLimitStore } from "@/lib/api/rate-limit";

import { POST } from "./route";

const generateContent = vi.fn();

vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(function GoogleGenAI() {
    return { models: { generateContent } };
  }),
}));

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/package-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/package-assistant", () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    resetRateLimitStore();
    generateContent.mockReset();
    process.env.GEMINI_API_KEY = "test-key";
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  });

  it("400s when the body is not valid JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/package-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      }),
    );

    expect(res.status).toBe(400);
  });

  it("400s when message is missing", async () => {
    const res = await POST(req({}));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe("bad_request");
  });

  it("400s when the message is too long", async () => {
    const res = await POST(req({ message: "a".repeat(4001) }));

    expect(res.status).toBe(400);
  });

  it("400s when history has more than 50 messages", async () => {
    const history = Array.from({ length: 51 }, () => ({
      role: "user",
      text: "hi",
    }));

    const res = await POST(req({ message: "hi", history }));

    expect(res.status).toBe(400);
  });

  it("returns the generated reply for a valid message", async () => {
    generateContent.mockResolvedValueOnce({ text: "Hello, Gopher here." });

    const res = await POST(req({ message: "hi" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.text).toBe("Hello, Gopher here.");
  });

  it("responds 503 (not an error envelope) when GEMINI_API_KEY is missing", async () => {
    delete process.env.GEMINI_API_KEY;

    const res = await POST(req({ message: "hi" }));
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.text).toMatch(/currently unavailable/i);
  });

  it("scopes the system instruction to the given package", async () => {
    generateContent.mockResolvedValueOnce({ text: "It's a web framework." });

    const res = await POST(
      req({
        message: "what is this?",
        importPath: "github.com/gin-gonic/gin",
        description: "<b>Gin</b> web framework",
      }),
    );

    expect(res.status).toBe(200);

    const [[call]] = generateContent.mock.calls;

    expect(call.config.systemInstruction).toContain("github.com/gin-gonic/gin");
    expect(call.config.systemInstruction).toContain("&lt;b&gt;Gin&lt;/b&gt;");
  });

  it("falls back to a generic description when none is given for a package", async () => {
    generateContent.mockResolvedValueOnce({ text: "ok" });

    await POST(
      req({
        message: "what is this?",
        importPath: "github.com/gin-gonic/gin",
      }),
    );

    const [[call]] = generateContent.mock.calls;

    expect(call.config.systemInstruction).toContain("A Go ecosystem package.");
  });

  it("forwards the conversation history to the model", async () => {
    generateContent.mockResolvedValueOnce({ text: "ok" });

    await POST(
      req({
        message: "and then?",
        history: [{ role: "user", text: "hi" }],
      }),
    );

    const [[call]] = generateContent.mock.calls;

    expect(call.contents[0]).toEqual({
      role: "user",
      parts: [{ text: "hi" }],
    });
  });

  it("falls back to a generic message when the model returns no text", async () => {
    generateContent.mockResolvedValueOnce({ text: "" });

    const res = await POST(req({ message: "hi" }));
    const body = await res.json();

    expect(body.text).toMatch(/could not generate a response/i);
  });

  it("maps a quota error to 429", async () => {
    generateContent.mockRejectedValueOnce(new Error("RESOURCE_EXHAUSTED"));

    const res = await POST(req({ message: "hi" }));
    const body = await res.json();

    expect(res.status).toBe(429);
    expect(body.error.code).toBe("rate_limited");
  });

  it("maps a 503/UNAVAILABLE error to service_unavailable", async () => {
    generateContent.mockRejectedValueOnce(new Error("503 UNAVAILABLE"));

    const res = await POST(req({ message: "hi" }));
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error.code).toBe("service_unavailable");
  });

  it("maps an unknown Error to internal_error", async () => {
    generateContent.mockRejectedValueOnce(new Error("boom"));

    const res = await POST(req({ message: "hi" }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });

  it("maps a non-Error throw to internal_error", async () => {
    generateContent.mockRejectedValueOnce("boom");

    const res = await POST(req({ message: "hi" }));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("internal_error");
  });

  it("rate limits after 10 requests from the same IP", async () => {
    generateContent.mockResolvedValue({ text: "ok" });

    const ip = "198.51.100.7";

    for (let i = 0; i < 10; i++) {
      const res = await POST(req({ message: "hi" }, { "x-forwarded-for": ip }));
      expect(res.status).toBe(200);
    }

    const blocked = await POST(
      req({ message: "hi" }, { "x-forwarded-for": ip }),
    );
    const body = await blocked.json();

    expect(blocked.status).toBe(429);
    expect(body.error.code).toBe("rate_limited");
  });
});
