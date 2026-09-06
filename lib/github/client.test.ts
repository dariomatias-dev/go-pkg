import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  escapeGoModule,
  getGithubHeaders,
  handleGithubError,
  parseGithubRepo,
  resilientFetch,
} from "./client";

describe("getGithubHeaders", () => {
  const originalToken = process.env.GITHUB_TOKEN;

  afterEach(() => {
    if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = originalToken;
  });

  it("omits the Authorization header when no token is set", () => {
    delete process.env.GITHUB_TOKEN;
    expect(getGithubHeaders().Authorization).toBeUndefined();
  });

  it("adds the Authorization header when a token is set", () => {
    process.env.GITHUB_TOKEN = "secret-token";
    expect(getGithubHeaders().Authorization).toBe("token secret-token");
  });
});

describe("handleGithubError", () => {
  const originalToken = process.env.GITHUB_TOKEN;

  beforeEach(() => {
    delete process.env.GITHUB_TOKEN;
  });

  afterEach(() => {
    if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = originalToken;
  });

  it("returns a rate-limit message for 403 without a token", () => {
    expect(handleGithubError(403, "search").message).toMatch(
      /rate limit exceeded/i,
    );
  });

  it("returns a rate-limit message for 429 without a token", () => {
    expect(handleGithubError(429, "search").message).toMatch(
      /rate limit exceeded/i,
    );
  });

  it("does not blame rate limiting for 403 when a token is set", () => {
    process.env.GITHUB_TOKEN = "secret-token";
    expect(handleGithubError(403, "search").message).not.toMatch(/rate limit/i);
  });

  it("returns a generic error message for other statuses", () => {
    expect(handleGithubError(500, "repo details").message).toBe(
      "GitHub API error: repo details failed with status 500",
    );
  });
});

describe("escapeGoModule", () => {
  it("lowercases and escapes uppercase letters with !", () => {
    expect(escapeGoModule("github.com/BurntSushi/toml")).toBe(
      "github.com/!burnt!sushi/toml",
    );
  });

  it("leaves already-lowercase paths untouched", () => {
    expect(escapeGoModule("github.com/gin-gonic/gin")).toBe(
      "github.com/gin-gonic/gin",
    );
  });
});

describe("parseGithubRepo", () => {
  it("resolves a direct github.com import path", () => {
    expect(parseGithubRepo("github.com/gin-gonic/gin")).toEqual({
      owner: "gin-gonic",
      repo: "gin",
    });
  });

  it("resolves vanity import paths via the mapping table", () => {
    expect(parseGithubRepo("go.uber.org/zap")).toEqual({
      owner: "uber-go",
      repo: "zap",
    });
    expect(parseGithubRepo("golang.org/x/net")).toEqual({
      owner: "golang",
      repo: "net",
    });
    expect(parseGithubRepo("gopkg.in/yaml.v3")).toEqual({
      owner: "go-yaml",
      repo: "yaml",
    });
  });

  it("returns null when the import path has no owner/repo segment", () => {
    expect(parseGithubRepo("example.com")).toBeNull();
  });

  it("prefixes an unmapped non-github host with github.com", () => {
    expect(parseGithubRepo("example.com/owner/repo")).toEqual({
      owner: "example.com",
      repo: "owner",
    });
  });
});

describe("resilientFetch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("returns the response immediately on success, without retrying", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("ok"));

    const res = await resilientFetch("https://example.com");

    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries a 5xx response with backoff and returns the eventual success", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response("ok"));

    const promise = resilientFetch("https://example.com");

    await vi.runAllTimersAsync();
    const res = await promise;

    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("gives up after the retry budget and returns the last failing response", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 502 }));

    const promise = resilientFetch("https://example.com", {}, { retries: 2 });

    await vi.runAllTimersAsync();
    const res = await promise;

    expect(res.status).toBe(502);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("does not retry a plain 4xx response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 404 }));

    const res = await resilientFetch("https://example.com");

    expect(res.status).toBe(404);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries a network error and returns the eventual success", async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce(new Response("ok"));

    const promise = resilientFetch("https://example.com");

    await vi.runAllTimersAsync();
    const res = await promise;

    expect(res.status).toBe(200);
  });

  it("throws once retries are exhausted for a persistent network error", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));

    const promise = resilientFetch("https://example.com", {}, { retries: 1 });
    const assertion = expect(promise).rejects.toThrow("network error");

    await vi.runAllTimersAsync();
    await assertion;
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("waits for a capped Retry-After before retrying a 429", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        new Response(null, { status: 429, headers: { "Retry-After": "1" } }),
      )
      .mockResolvedValueOnce(new Response("ok"));

    const promise = resilientFetch("https://example.com");

    await vi.runAllTimersAsync();
    const res = await promise;

    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("returns a 429 as-is when it carries no Retry-After header", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 429 }));

    const res = await resilientFetch("https://example.com");

    expect(res.status).toBe(429);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
