import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";

import type { SearchOrder, SearchSort } from "@/lib/github";
import { searchGithubPackages } from "@/lib/github";

async function getCachedSearch(
  query: string,
  category: string,
  tag: string,
  page: number,
  perPage: number,
  sort: SearchSort,
  order: SearchOrder,
) {
  "use cache";

  cacheLife({ revalidate: 300 });

  return searchGithubPackages(query, category, tag, page, perPage, sort, order);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    const category = url.searchParams.get("category") ?? "";
    const tag = url.searchParams.get("tag") ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const perPage = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("perPage") ?? "10")),
    );
    const sort = (url.searchParams.get("sort") ?? "best") as SearchSort;
    const order = (url.searchParams.get("order") ?? "desc") as SearchOrder;

    const data = await getCachedSearch(
      query,
      category,
      tag,
      page,
      perPage,
      sort,
      order,
    );

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
