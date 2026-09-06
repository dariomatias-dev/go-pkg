import { describe, expect, it } from "vitest";

import {
  packageAssistantBodySchema,
  packageVersionsQuerySchema,
  parseQuery,
  popularPackageQuerySchema,
  searchQuerySchema,
} from "./schemas";

function query(params: Record<string, string>): URLSearchParams {
  return new URLSearchParams(params);
}

describe("packageVersionsQuerySchema", () => {
  it("requires importPath", () => {
    const result = parseQuery(packageVersionsQuerySchema, query({}));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/required/i);
    }
  });

  it("rejects an invalid importPath", () => {
    const result = parseQuery(
      packageVersionsQuerySchema,
      query({ importPath: "; rm -rf" }),
    );

    expect(result.success).toBe(false);
  });

  it("defaults page/perPage and clamps out-of-range values", () => {
    const result = parseQuery(
      packageVersionsQuerySchema,
      query({ importPath: "github.com/a/b", perPage: "9999" }),
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      // perPage over the max falls back to the schema's default (10)
      // rather than 400ing or silently clamping to the max.
      expect(result.data.perPage).toBe(10);
    }
  });
});

describe("searchQuerySchema", () => {
  it("falls back to safe defaults for garbage sort/order", () => {
    const result = parseQuery(
      searchQuerySchema,
      query({ q: "gin", sort: "nonsense", order: "sideways" }),
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sort).toBe("stars");
      expect(result.data.order).toBe("desc");
    }
  });

  it("accepts a valid sort/order combination", () => {
    const result = parseQuery(
      searchQuerySchema,
      query({ sort: "updated", order: "asc" }),
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sort).toBe("updated");
      expect(result.data.order).toBe("asc");
    }
  });
});

describe("popularPackageQuerySchema", () => {
  it("defaults page and perPage when absent", () => {
    const result = parseQuery(popularPackageQuerySchema, query({}));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ page: 1, perPage: 10 });
    }
  });
});

describe("packageAssistantBodySchema", () => {
  it("requires a non-empty message", () => {
    const result = packageAssistantBodySchema.safeParse({ message: "" });

    expect(result.success).toBe(false);
  });

  it("defaults history to an empty array", () => {
    const result = packageAssistantBodySchema.safeParse({ message: "hi" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.history).toEqual([]);
    }
  });

  it("rejects a history longer than 50 messages", () => {
    const history = Array.from({ length: 51 }, () => ({
      role: "user" as const,
      text: "hi",
    }));

    const result = packageAssistantBodySchema.safeParse({
      message: "hi",
      history,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid importPath but allows omitting it", () => {
    expect(
      packageAssistantBodySchema.safeParse({
        message: "hi",
        importPath: "; rm -rf",
      }).success,
    ).toBe(false);

    expect(
      packageAssistantBodySchema.safeParse({ message: "hi" }).success,
    ).toBe(true);
  });
});
