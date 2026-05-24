import { NextResponse } from "next/server";

import { searchGithubPackages } from "@/lib/github";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    const category = url.searchParams.get("category") ?? "";
    const tag = url.searchParams.get("tag") ?? "";
    const page = Number(url.searchParams.get("page") ?? "1");
    const perPage = Number(url.searchParams.get("perPage") ?? "10");

    const data = await searchGithubPackages(
      query,
      category,
      tag,
      page,
      perPage,
    );

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to execute package search" },
      { status: 500 },
    );
  }
}
