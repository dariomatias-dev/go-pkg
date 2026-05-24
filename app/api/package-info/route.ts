import { NextResponse } from "next/server";

import { getPackageDetail } from "@/lib/github";

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

    const data = await getPackageDetail(importPath);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load package details" },
      { status: 500 },
    );
  }
}
