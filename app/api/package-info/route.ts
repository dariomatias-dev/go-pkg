import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { getPackageDetail } from "@/lib/github";

const getCachedPackageDetail = unstable_cache(
  async (importPath: string) => {
    return getPackageDetail(importPath);
  },
  ["package-detail"],
  { revalidate: 1800 },
);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const importPath = url.searchParams.get("importPath");

    if (!importPath) {
      return NextResponse.json(
        { error: "Missing importPath path" },
        { status: 400 },
      );
    }

    const data = await getCachedPackageDetail(importPath);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load package details" },
      { status: 500 },
    );
  }
}
