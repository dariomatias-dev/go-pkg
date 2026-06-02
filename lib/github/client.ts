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

export function handleGithubError(status: number, context: string): Error {
  if ((status === 403 || status === 429) && !process.env.GITHUB_TOKEN) {
    return new Error(
      `GitHub API rate limit exceeded (${context}). Set GITHUB_TOKEN in your environment to increase the limit from 60 to 5000 requests/hour.`,
    );
  }

  return new Error(`GitHub API error: ${context} failed with status ${status}`);
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
