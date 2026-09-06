import { z } from "zod";

import { isValidImportPath } from "@/lib/validations";

const importPathSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "The importPath parameter is required."
        : "Invalid importPath.",
  })
  .min(1, "The importPath parameter is required.")
  .refine(isValidImportPath, "Invalid importPath.");

const page = z.coerce.number().int().min(1).catch(1);
const perPage = (max: number, fallback: number) =>
  z.coerce.number().int().min(1).max(max).catch(fallback);

export const packageInfoQuerySchema = z.object({
  importPath: importPathSchema,
});

export const packageVersionsQuerySchema = z.object({
  importPath: importPathSchema,
  page,
  perPage: perPage(50, 10),
});

export const packageReleasesQuerySchema = z.object({
  importPath: importPathSchema,
  page,
  perPage: perPage(100, 30),
});

export const packageReportQuerySchema = z.object({
  importPath: importPathSchema,
});

export const packageSummaryQuerySchema = z.object({
  importPath: importPathSchema,
});

export const searchSortSchema = z.enum(["best", "stars", "updated", "forks"]);
export const searchOrderSchema = z.enum(["asc", "desc"]);

export const searchQuerySchema = z.object({
  q: z.string().max(300).catch(""),
  category: z.string().max(100).catch(""),
  tag: z.string().max(100).catch(""),
  page,
  perPage: perPage(100, 10),
  sort: searchSortSchema.catch("stars"),
  order: searchOrderSchema.catch("desc"),
});

export const popularPackageQuerySchema = z.object({
  page,
  perPage: perPage(40, 10),
});

const chatMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z.string().max(4000, "History message too long."),
});

export const packageAssistantBodySchema = z.object({
  message: z
    .string({
      error: () => 'The "message" field is required.',
    })
    .min(1, 'The "message" field is required.')
    .max(4000, "Message too long."),
  history: z.array(chatMessageSchema).max(50, "History too long.").default([]),
  importPath: importPathSchema.optional(),
  description: z.string().max(500, "Description too long.").optional(),
});

/**
 * Parses a URL's query string with a zod object schema whose fields are
 * all optional/defaulted — every field uses `.catch()` so a malformed
 * value falls back instead of 400ing, except importPath (explicitly
 * required where used) which surfaces as a validation failure.
 */
export function parseQuery<T extends z.ZodType>(
  schema: T,
  searchParams: URLSearchParams,
): z.ZodSafeParseResult<z.infer<T>> {
  return schema.safeParse(Object.fromEntries(searchParams.entries()));
}
