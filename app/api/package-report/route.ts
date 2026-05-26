import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { parseGithubRepo } from "@/lib/github/client";

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

const fetchReportCard = (repo: string) =>
  unstable_cache(
    async (): Promise<GoReportCardResult | null> => {
      const reportUrl = `https://goreportcard.com/report/${repo}`;
      const badgeUrl = `https://goreportcard.com/badge/${repo}`;

      const res = await fetch(badgeUrl, {
        headers: { "User-Agent": "GoPackageSearchApp" },
      });

      if (!res.ok) return null;

      const svg = await res.text();
      const grade = extractGrade(svg);

      if (!grade) return null;

      return { grade, reportUrl };
    },
    ["go-report-card", repo],
    { revalidate: 86400 },
  )();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const importPath = url.searchParams.get("importPath");

  if (!importPath) {
    return NextResponse.json({ error: "Missing importPath" }, { status: 400 });
  }

  const repoInfo = parseGithubRepo(importPath);

  if (!repoInfo) {
    return NextResponse.json(
      { error: "Not a GitHub package" },
      { status: 422 },
    );
  }

  try {
    const repo = `github.com/${repoInfo.owner}/${repoInfo.repo}`;
    const result = await fetchReportCard(repo);

    if (!result) {
      return NextResponse.json(
        { error: "Report not available" },
        { status: 404 },
      );
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch report card" },
      { status: 500 },
    );
  }
}
