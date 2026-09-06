import type { GoPackage, PopularPackage } from "@/types";

export const GIN: GoPackage = {
  name: "gin",
  importPath: "github.com/gin-gonic/gin",
  description: "Gin is a HTTP web framework written in Go.",
  stars: 81000,
  forks: 8600,
  license: "MIT",
  latestVersion: "v1.10.0",
  category: "Web Frameworks & APIs",
  tags: ["gin", "web", "framework", "http"],
  author: "gin-gonic",
  githubUrl: "https://github.com/gin-gonic/gin",
  publishedAt: "2024-05-01",
  dependenciesCount: 12,
  readme: "# gin\n\nA fast HTTP web framework.",
};

export const ECHO: GoPackage = {
  name: "echo",
  importPath: "github.com/labstack/echo",
  description: "High performance, minimalist Go web framework.",
  stars: 30000,
  forks: 1700,
  license: "MIT",
  latestVersion: "v4.12.0",
  category: "Web Frameworks & APIs",
  tags: ["echo", "web", "framework", "http"],
  author: "labstack",
  githubUrl: "https://github.com/labstack/echo",
  publishedAt: "2024-04-10",
  dependenciesCount: 9,
  readme: "# echo\n\nA minimalist web framework.",
};

export const SAMPLE_PACKAGES: GoPackage[] = [GIN, ECHO];

export function toPopularPackage(pkg: GoPackage): PopularPackage {
  return {
    importPath: pkg.importPath,
    name: pkg.name,
    description: pkg.description,
    stars: pkg.stars,
    forks: pkg.forks,
    license: pkg.license,
    author: pkg.author,
    publishedAt: pkg.publishedAt,
    category: pkg.category,
    tags: pkg.tags,
    githubUrl: pkg.githubUrl,
  };
}
