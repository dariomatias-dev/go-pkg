import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { searchGithubPackages } from "@/lib/github";

const getCachedSearch = unstable_cache(
  async (
    query: string,
    category: string,
    tag: string,
    page: number,
    perPage: number,
  ) => {
    return searchGithubPackages(query, category, tag, page, perPage);
  },
  ["package-search"],
  { revalidate: 300 },
);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    const category = url.searchParams.get("category") ?? "";
    const tag = url.searchParams.get("tag") ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const perPage = Number(url.searchParams.get("perPage") ?? "10");

    const data = await getCachedSearch(query, category, tag, page, perPage);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to execute package search" },
      { status: 500 },
    );
  }
}
