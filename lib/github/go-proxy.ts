import { GO_PROXY_BASE, escapeGoModule } from "./client";
import type { GoProxyLatest } from "./types";

export async function fetchGoMod(
  importPath: string,
  version: string,
): Promise<string> {
  const escaped = escapeGoModule(importPath);
  const res = await fetch(`${GO_PROXY_BASE}/${escaped}/@v/${version}.mod`);

  if (!res.ok) return "";

  return res.text();
}

export function countGoModDependencies(goMod: string): number {
  const lines = goMod.split("\n");
  let count = 0;
  let inRequire = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("require (")) {
      inRequire = true;

      continue;
    }

    if (inRequire && trimmed === ")") {
      inRequire = false;

      continue;
    }

    if (trimmed.startsWith("require ")) {
      count += 1;
    } else if (inRequire && trimmed && !trimmed.startsWith("//")) {
      count += 1;
    }
  }

  return count;
}

export async function enrichWithGoProxy(
  importPath: string,
): Promise<{ latestVersion: string; dependenciesCount: number }> {
  const escaped = escapeGoModule(importPath);
  try {
    const res = await fetch(`${GO_PROXY_BASE}/${escaped}/@latest`, {
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) return { latestVersion: "", dependenciesCount: 0 };

    const info = (await res.json()) as GoProxyLatest;
    const version = info.Version ?? "";

    if (!version) return { latestVersion: "", dependenciesCount: 0 };

    const goMod = await fetchGoMod(importPath, version);

    return {
      latestVersion: version,
      dependenciesCount: goMod ? countGoModDependencies(goMod) : 0,
    };
  } catch {
    return { latestVersion: "", dependenciesCount: 0 };
  }
}
