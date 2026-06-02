import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";

import { getPackageDetail } from "@/lib/github";
import { isValidImportPath } from "@/lib/validations";

async function getCachedPackageDetail(importPath: string) {
  "use cache";

  cacheLife({ revalidate: 1800 });

  return getPackageDetail(importPath);
}

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

    if (!isValidImportPath(importPath)) {
      return NextResponse.json({ error: "Invalid importPath" }, { status: 400 });
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
