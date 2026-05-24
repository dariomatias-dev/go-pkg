import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const importPath = url.searchParams.get("importPath");

  if (!importPath) {
    return NextResponse.json(
      { error: 'The "importPath" parameter is required' },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      error:
        "AI service not configured. Set up an API key to enable intelligent summaries.",
    },
    { status: 503 },
  );
}
