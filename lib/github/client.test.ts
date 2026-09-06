import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  escapeGoModule,
  getGithubHeaders,
  handleGithubError,
  parseGithubRepo,
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
