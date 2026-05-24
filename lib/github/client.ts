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

export function escapeGoModule(modulePath: string): string {
  return modulePath.replace(/([A-Z])/g, "!$1").toLowerCase();
}

export function parseGithubRepo(
  modulePath: string,
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

  const normalized = mapping[modulePath] ?? modulePath;
  const target = normalized.startsWith("github.com/")
    ? normalized
    : `github.com/${normalized}`;
  const parts = target.split("/");

  if (parts.length < 3) return null;

  const owner = parts[1];

  let repo = parts[2];

  if (repo.includes(".")) repo = repo.split(".")[0];

  return { owner, repo };
}
