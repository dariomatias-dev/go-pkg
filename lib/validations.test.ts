import { describe, expect, it } from "vitest";

import { isValidImportPath } from "./validations";

describe("isValidImportPath", () => {
  it("accepts a typical Go import path", () => {
    expect(isValidImportPath("github.com/gin-gonic/gin")).toBe(true);
  });

  it("accepts vanity import paths with dots and tildes", () => {
    expect(isValidImportPath("go.uber.org/zap")).toBe(true);
    expect(isValidImportPath("gopkg.in/yaml.v3")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidImportPath("")).toBe(false);
  });

  it("rejects a path starting with a disallowed character", () => {
    expect(isValidImportPath("/etc/passwd")).toBe(false);
    expect(isValidImportPath("-rf")).toBe(false);
  });

  it("rejects paths containing spaces or shell metacharacters", () => {
    expect(isValidImportPath("github.com/foo bar")).toBe(false);
    expect(isValidImportPath("github.com/foo;rm -rf")).toBe(false);
    expect(isValidImportPath("github.com/foo$(whoami)")).toBe(false);
  });

  it("rejects paths longer than 300 characters", () => {
    const long = "github.com/" + "a".repeat(300);
    expect(isValidImportPath(long)).toBe(false);
  });

  it("accepts a path exactly at the 300 character limit", () => {
    const exact = "a".repeat(300);
    expect(isValidImportPath(exact)).toBe(true);
  });
});
