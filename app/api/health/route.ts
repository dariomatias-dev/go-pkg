import {
  GITHUB_BASE_URL,
  GO_PROXY_BASE,
  resilientFetch,
} from "@/lib/github/client";

type DependencyStatus = "up" | "down";

interface DependencyCheck {
  status: DependencyStatus;
  latencyMs?: number;
  detail?: string;
}

async function checkUpstream(
  url: string,
  init?: RequestInit,
): Promise<DependencyCheck> {
  const startedAt = Date.now();

  try {
    const res = await resilientFetch(
      url,
      init,
      // Health checks must be fast and not amplify an outage into a
      // pile of retried requests: no retries, tight timeout.
      { retries: 0, timeoutMs: 4000 },
    );

    return {
      status: res.ok ? "up" : "down",
      latencyMs: Date.now() - startedAt,
      ...(res.ok ? {} : { detail: `HTTP ${res.status}` }),
    };
  } catch (error) {
    return {
      status: "down",
      latencyMs: Date.now() - startedAt,
      detail: error instanceof Error ? error.name : "unknown error",
    };
  }
}

export async function GET() {
  const [github, goProxy] = await Promise.all([
    // /rate_limit is a cheap, unauthenticated-friendly endpoint that
    // doesn't itself consume the search/core rate limit budget.
    checkUpstream(`${GITHUB_BASE_URL}/rate_limit`),
    checkUpstream(`${GO_PROXY_BASE}/golang.org/x/mod/@v/list`),
  ]);

  // Gemini has no free/cheap health-check endpoint: pinging it for real
  // would spend paid quota on every uptime-monitor poll. Reporting
  // whether the key is configured is what's actually actionable here -
  // the AI routes already degrade to a clear 503 message when it's not.
  const gemini: DependencyCheck & { configured: boolean } = {
    status: process.env.GEMINI_API_KEY ? "up" : "down",
    configured: Boolean(process.env.GEMINI_API_KEY),
    ...(process.env.GEMINI_API_KEY ? {} : { detail: "GEMINI_API_KEY not set" }),
  };

  const checks = { github, goProxy, gemini };
  const allUp = Object.values(checks).every((c) => c.status === "up");

  return Response.json(
    {
      status: allUp ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    {
      status: allUp ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
