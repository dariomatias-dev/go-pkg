import { GoogleGenAI } from "@google/genai";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

const getCachedSummary = unstable_cache(
  async (importPath: string) => {
    const apiKey = process.env.GEMINI_API_KEY!;
    const ai = new GoogleGenAI({ apiKey });
    const packageName = importPath.split("/").pop() || importPath;

    const prompt = `
You are Gopher AI, a technical expert in Go (Golang) and its ecosystem.

Generate a concise technical summary for the Go package below:

Import path: "${importPath}"
Package name: "${packageName}"

The response must be written in English and include:

1. A short description of the package and its main purpose
2. Key features and capabilities
3. A practical Go code example showing how to import and use it
4. Common use cases in Go projects

Format the response using Markdown.
Keep the explanation concise, practical, and developer-focused.
Do not include comments inside code snippets.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.5,
      },
    });

    return response.text || "Summary not available.";
  },
  ["package-summary"],
  { revalidate: 86400 },
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const importPath = url.searchParams.get("importPath");

  if (!importPath) {
    return NextResponse.json(
      { error: 'The "importPath" parameter is required.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI service is not configured. Please set the GEMINI_API_KEY environment variable.",
      },
      { status: 503 },
    );
  }

  try {
    const summary = await getCachedSummary(importPath);

    return NextResponse.json(
      { summary },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (error) {
    console.error("Summary generation error:", error);

    const isRateLimit =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status: number }).status === 429;

    if (isRateLimit) {
      return NextResponse.json(
        {
          error: "API rate limit reached. Please try again in a few seconds.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate AI summary. Please try again.",
      },
      { status: 500 },
    );
  }
}
