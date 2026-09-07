export const USER_AGENT = "GoPackageSearchApp";
export const GITHUB_BASE_URL = "https://api.github.com";
export const GO_PROXY_BASE = "https://proxy.golang.org";

export function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": USER_AGENT,
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

const DEFAULT_TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;
const MAX_RETRY_AFTER_MS = 10_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryAfterMs(res: Response): number | null {
  const header = res.headers.get("Retry-After");

  if (!header) return null;

  const seconds = Number(header);

  if (!Number.isFinite(seconds) || seconds < 0) return null;

  return Math.min(seconds * 1000, MAX_RETRY_AFTER_MS);
}

/**
 * fetch() with a request timeout and bounded retries: 5xx and network
 * errors are retried with exponential backoff, 403/429 are retried once
 * if the response carries a (capped) Retry-After, and every other 4xx is
 * returned as-is on the first attempt - retrying a client error just
 * repeats the same failure.
 */
export async function resilientFetch(
  url: string,
  init: RequestInit = {},
  { timeoutMs = DEFAULT_TIMEOUT_MS, retries = MAX_RETRIES } = {},
): Promise<Response> {
  let attempt = 0;

  while (true) {
    try {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (res.ok || attempt >= retries) return res;

      if (res.status >= 500) {
        await sleep(2 ** attempt * 200);
        attempt++;

        continue;
      }

      if (res.status === 403 || res.status === 429) {
        const waitMs = retryAfterMs(res);

        if (waitMs === null) return res;

        await sleep(waitMs);
        attempt++;

        continue;
      }

      return res;
    } catch (err) {
      if (attempt >= retries) throw err;

      await sleep(2 ** attempt * 200);
      attempt++;
    }
  }
}

/**
 * Thrown by handleGithubError. `isRateLimited` lets callers (route
 * handlers, UI error states) distinguish "GitHub is throttling us" from
 * a generic upstream failure, so the specific, actionable message
 * reaches the response instead of being collapsed into a generic
 * "something went wrong."
 */
export class GithubApiError extends Error {
  isRateLimited: boolean;

  constructor(message: string, isRateLimited: boolean) {
    super(message);
    this.name = "GithubApiError";
    this.isRateLimited = isRateLimited;
  }
}

export function handleGithubError(
  status: number,
  context: string,
): GithubApiError {
  if ((status === 403 || status === 429) && !process.env.GITHUB_TOKEN) {
    return new GithubApiError(
      `GitHub API rate limit exceeded (${context}). Set GITHUB_TOKEN in your environment to increase the limit from 60 to 5000 requests/hour.`,
      true,
    );
  }

  return new GithubApiError(
    `GitHub API error: ${context} failed with status ${status}`,
    false,
  );
}

export function escapeGoModule(importPath: string): string {
  return importPath.replace(/([A-Z])/g, "!$1").toLowerCase();
}

export function parseGithubRepo(
  importPath: string,
): { owner: string; repo: string } | null {
  const mapping: Record<string, string> = {
    "go.uber.org/zap": "uber-go/zap",
    "go.uber.org/multierr": "uber-go/multierr",
    "go.uber.org/atomic": "uber-go/atomic",
    "golang.org/x/net": "golang/net",
    "golang.org/x/sys": "golang/sys",
    "golang.org/x/text": "golang/text",
    "golang.org/x/crypto": "golang/crypto",
    "golang.org/x/oauth2": "golang/oauth2",
    "golang.org/x/sync": "golang/sync",
    "golang.org/x/term": "golang/term",
    "golang.org/x/time": "golang/time",
    "gopkg.in/yaml.v2": "go-yaml/yaml",
    "gopkg.in/yaml.v3": "go-yaml/yaml",
  };

  const normalized = mapping[importPath] ?? importPath;
  const target = normalized.startsWith("github.com/")
    ? normalized
    : `github.com/${normalized}`;
  const parts = target.split("/");

  if (parts.length < 3) return null;

  const owner = parts[1];

  const repo = parts[2];

  return { owner, repo };
}
