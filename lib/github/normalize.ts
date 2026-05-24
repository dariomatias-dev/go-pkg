import type { GoPackage } from "@/types";

import type { GitHubRepo } from "./types";

export function guessCategory(name: string, description: string): string {
  const n = name.toLowerCase();
  const d = description.toLowerCase();

  if (
    n.includes("db") ||
    n.includes("sql") ||
    n.includes("orm") ||
    d.includes("database")
  )
    return "database";
  if (n.includes("cli") || n.includes("command") || d.includes("cli"))
    return "cli";
  if (n.includes("log") || d.includes("logging") || d.includes("telemetry"))
    return "logging";
  if (n.includes("test") || d.includes("mock") || d.includes("assert"))
    return "testing";
  if (
    n.includes("http") ||
    n.includes("grpc") ||
    d.includes("api") ||
    d.includes("web")
  )
    return "web";

  return "utilities";
}

export function buildSearchQuery(
  query: string,
  category: string,
  tag: string,
): string {
  const terms = ["language:go"];

  if (query) terms.push(query);

  if (category) {
    const categoryTerms: Record<string, string> = {
      web: "(web OR http OR api OR grpc OR router OR framework)",
      database: "(database OR orm OR sql OR postgres OR redis OR mysql)",
      cli: "(cli OR command OR terminal OR flag)",
      logging: "(logging OR telemetry OR metrics OR prometheus OR tracing)",
      testing: "(testing OR mock OR assert OR suite)",
    };

    terms.push(categoryTerms[category] ?? category);
  }

  if (tag) terms.push(tag);

  return terms.join(" ");
}

export function normalizePackage(
  item: GitHubRepo,
  category?: string,
): GoPackage {
  const modulePath = `github.com/${item.full_name}`;

  return {
    name: item.name,
    modulePath,
    description: item.description ?? "No description available.",
    stars: item.stargazers_count ?? 0,
    forks: item.forks_count ?? 0,
    license: item.license?.spdx_id ?? item.license?.name ?? "Unknown",
    latestVersion: "See repository",
    category: category || guessCategory(item.name, item.description ?? ""),
    tags: [item.name.toLowerCase(), ...(item.topics ?? []).slice(0, 5)],
    author: item.owner?.login ?? "unknown",
    githubUrl: item.html_url,
    publishedAt: item.updated_at
      ? new Date(item.updated_at).toISOString().split("T")[0]
      : "Unknown",
    dependenciesCount: 0,
    importsCount: 0,
  };
}
