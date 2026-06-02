import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";

import { GO_PROXY_BASE, escapeGoModule } from "@/lib/github/client";
import { isValidImportPath } from "@/lib/validations";

async function getVersions(importPath: string): Promise<string[]> {
  "use cache";
  cacheLife({ revalidate: 3600 });

  const escaped = escapeGoModule(importPath);
  const res = await fetch(`${GO_PROXY_BASE}/${escaped}/@v/list`);

  if (!res.ok) return [];
  return (await res.text()).split("\n").filter(Boolean).reverse();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const importPath = url.searchParams.get("importPath");
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const perPage = Math.min(
    50,
    Math.max(1, Number(url.searchParams.get("perPage") ?? "10")),
  );

  if (!importPath) {
    return NextResponse.json({ error: "Missing importPath" }, { status: 400 });
  }

  if (!isValidImportPath(importPath)) {
    return NextResponse.json({ error: "Invalid importPath" }, { status: 400 });
  }

  try {
    const all = await getVersions(importPath);
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * perPage;
    const versions = all.slice(start, start + perPage);

    return NextResponse.json(
      { versions, total, page: safePage, totalPages },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 },
    );
  }
}
