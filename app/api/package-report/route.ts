import { cacheLife } from "next/cache";

import { ApiErrors, ok } from "@/lib/api/response";
import { packageReportQuerySchema, parseQuery } from "@/lib/api/schemas";
import { parseGithubRepo, resilientFetch } from "@/lib/github/client";
import { logger } from "@/lib/logger";

export interface GoReportCardResult {
  grade: string;
  reportUrl: string;
}

const GRADE_COLORS: Record<string, string> = {
  "A+": "#4caf50",
  A: "#4caf50",
  B: "#9e9e9e",
  C: "#ff9800",
  D: "#f44336",
  F: "#b71c1c",
};

function extractGrade(svg: string): string {
  const matches = svg.matchAll(/<text[^>]*>([A-F][+]?)<\/text>/g);

  for (const m of matches) {
    const candidate = m[1];

    if (GRADE_COLORS[candidate]) return candidate;
  }

  return "";
}

async function fetchReportCard(
  repo: string,
): Promise<GoReportCardResult | null> {
  "use cache";

  cacheLife({ revalidate: 86400 });

  const reportUrl = `https://goreportcard.com/report/${repo}`;
  const badgeUrl = `https://goreportcard.com/badge/${repo}`;

  const res = await resilientFetch(badgeUrl, {
    headers: { "User-Agent": "GoPackageSearchApp" },
  });

  if (!res.ok) return null;

  const svg = await res.text();
  const grade = extractGrade(svg);

  if (!grade) return null;

  return { grade, reportUrl };
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  const url = new URL(request.url);
  const parsed = parseQuery(packageReportQuerySchema, url.searchParams);

  if (!parsed.success) {
    return ApiErrors.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid request.",
    );
  }

  const repoInfo = parseGithubRepo(parsed.data.importPath);

  if (!repoInfo) {
    return ApiErrors.unprocessable("Not a GitHub package.");
  }

  try {
    const repo = `github.com/${repoInfo.owner}/${repoInfo.repo}`;
    const result = await fetchReportCard(repo);

    if (!result) {
      return ApiErrors.notFound("Report not available.");
    }

    return ok(result, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    logger.error("Failed to fetch report card", {
      route: "package-report",
      durationMs: Date.now() - startedAt,
      status: 500,
      errorName: error instanceof Error ? error.name : "unknown",
    });

    return ApiErrors.internal("Failed to fetch report card.");
  }
}
