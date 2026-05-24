import { NextResponse } from "next/server";

import { CURATED_CATEGORIES } from "@/lib/curated-categories";
import { fetchPopularPackages } from "@/lib/github";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const perPage = Math.min(40, Math.max(1, Number(searchParams.get("perPage") ?? "10")));

    const { packages, total } = await fetchPopularPackages(page, perPage);
    const uniqueTags = Array.from(
      new Set(packages.flatMap((pkg) => pkg.tags)),
    ).slice(0, 18);

    return NextResponse.json({
      packages,
      categories: CURATED_CATEGORIES,
      popularTags: uniqueTags,
      page,
      perPage,
      total,
      hasMore: page * perPage < total,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load popular packages" },
      { status: 500 },
    );
  }
}
