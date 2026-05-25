import type { GoPackage, PackageDetailResponse } from "@/types";

import {
  GITHUB_BASE_URL,
  GO_PROXY_BASE,
  escapeGoModule,
  getGithubHeaders,
  parseGithubRepo,
} from "./client";
import { countGoModDependencies, fetchGoMod } from "./go-proxy";
import type { GitHubRepo, GoProxyLatest } from "./types";

export async function getPackageDetail(
  importPath: string,
): Promise<PackageDetailResponse> {
  const pkgName = importPath.split("/").pop() || importPath;
  const pkg: GoPackage = {
    name: pkgName,
    importPath,
    description: "Go package discovered on demand.",
    stars: 0,
    forks: 0,
    license: "View on GitHub",
    latestVersion: "v0.0.0",
    category: "utilities",
    tags: [importPath.toLowerCase()],
    author: importPath.split("/")[1] || "go-community",
    publishedAt: "Unknown",
    dependenciesCount: 0,
    importsCount: 0,
  };

  const escaped = escapeGoModule(importPath);
  let versions: string[] = [];

  try {
    const res = await fetch(`${GO_PROXY_BASE}/${escaped}/@v/list`);

    if (res.ok) {
      versions = (await res.text()).split("\n").filter(Boolean).reverse();
    }
  } catch (err) {
    console.warn("Failed to fetch version list", err);
  }

  if (versions.length > 0) {
    pkg.latestVersion = versions[0];
    pkg.versions = versions.slice(0, 50);
  } else {
    try {
      const res = await fetch(`${GO_PROXY_BASE}/${escaped}/@latest`);

      if (res.ok) {
        const info = (await res.json()) as GoProxyLatest;

        pkg.latestVersion = info.Version ?? pkg.latestVersion;
        pkg.publishedAt = info.Time
          ? new Date(info.Time).toISOString().split("T")[0]
          : pkg.publishedAt;
      }
    } catch (err) {
      console.warn("Failed to fetch latest version", err);
    }
  }

  let goMod = "";

  if (pkg.latestVersion) {
    goMod = await fetchGoMod(importPath, pkg.latestVersion);

    if (goMod) pkg.dependenciesCount = countGoModDependencies(goMod);
  }

  const repoInfo = parseGithubRepo(importPath);

  if (repoInfo) {
    try {
      const res = await fetch(
        `${GITHUB_BASE_URL}/repos/${repoInfo.owner}/${repoInfo.repo}`,
        { headers: getGithubHeaders() },
      );

      if (res.ok) {
        const repo = (await res.json()) as GitHubRepo;

        pkg.stars = repo.stargazers_count ?? pkg.stars;
        pkg.forks = repo.forks_count ?? pkg.forks;
        pkg.license =
          repo.license?.spdx_id ?? repo.license?.name ?? pkg.license;
        pkg.description = repo.description || pkg.description;
        pkg.githubUrl = `https://github.com/${repoInfo.owner}/${repoInfo.repo}`;
      }
    } catch (err) {
      console.warn("Failed to fetch GitHub repo details", err);
    }

    const branches = ["main", "master", "develop", "v1", "v2"];
    const filenames = [
      "README.md",
      "readme.md",
      "README.markdown",
      "readme.markdown",
      "README.rst",
    ];

    outer: for (const branch of branches) {
      for (const filename of filenames) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/${filename}`,
          );

          if (res.ok) {
            pkg.readme = await res.text();

            break outer;
          }
        } catch {}
      }
    }
  }

  if (!pkg.readme) {
    pkg.readme = `# ${pkg.name}\n\nNo README was found automatically.\n\nUse the package details to inspect the Go module and the repository on GitHub.`;
  }

  return { pkg, goMod, isCustom: true };
}
