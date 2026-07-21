#!/usr/bin/env node
// Screenshots every app route into public/screenshots/.
// Usage: node scripts/screenshot-pages.mjs [--base-url http://localhost:3000]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/screenshots");
const baseUrl = process.argv.includes("--base-url")
  ? process.argv[process.argv.indexOf("--base-url") + 1]
  : "http://localhost:3000";

// Fixture packages, used to seed compare/favorites so those pages
// show real content regardless of GitHub API/token availability.
const SAMPLE_PACKAGES = [
  {
    importPath: "github.com/gin-gonic/gin",
    name: "gin",
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
  },
  {
    importPath: "github.com/labstack/echo",
    name: "echo",
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
  },
  {
    importPath: "github.com/go-chi/chi",
    name: "chi",
    description:
      "Lightweight, idiomatic and composable router for Go HTTP services.",
    stars: 18000,
    forks: 900,
    license: "MIT",
    latestVersion: "v5.0.12",
    category: "Web Frameworks & APIs",
    tags: ["chi", "router", "http"],
    author: "go-chi",
    githubUrl: "https://github.com/go-chi/chi",
    publishedAt: "2024-02-20",
    dependenciesCount: 3,
  },
];

const PAGES = [
  { name: "home", path: "/" },
  { name: "search", path: "/search?q=gin" },
  { name: "popular", path: "/popular" },
  {
    name: "compare",
    path: `/compare?${SAMPLE_PACKAGES.map((p) => `pkg=${encodeURIComponent(p.importPath)}`).join("&")}`,
    mockPackageInfo: true,
  },
  { name: "favorites", path: "/favorites", seedFavorites: true },
  { name: "package-detail", path: "/package/github.com/gin-gonic/gin" },
];

async function mockPackageInfoRoute(page) {
  await page.route("**/api/package-info**", (route) => {
    const url = new URL(route.request().url());
    const importPath = url.searchParams.get("importPath");
    const pkg = SAMPLE_PACKAGES.find((p) => p.importPath === importPath);

    if (!pkg) return route.continue();

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ pkg }),
    });
  });
}

async function hideDevIndicator(page) {
  await page.addStyleTag({
    content:
      "[data-nextjs-dev-tools-button], nextjs-portal { display: none !important; }",
  });
}

async function seedFavorites(page) {
  await page.goto(baseUrl, { waitUntil: "load", timeout: 30000 });
  await page.evaluate((packages) => {
    localStorage.setItem("gopkg_favorites", JSON.stringify(packages));
  }, SAMPLE_PACKAGES);
}

async function shootPage(page, entry) {
  const { name, path: route } = entry;
  const url = baseUrl + route;

  try {
    if (entry.mockPackageInfo) await mockPackageInfoRoute(page);
    if (entry.seedFavorites) await seedFavorites(page);

    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page
      .waitForLoadState("networkidle", { timeout: 15000 })
      .catch(() => {});
    await page.waitForTimeout(1500);
    await hideDevIndicator(page);
    await page.screenshot({
      path: `${outDir}/${name}.png`,
    });
    console.log(`OK   ${name} <- ${url}`);
  } catch (err) {
    console.log(`FAIL ${name} <- ${url}: ${err.message}`);
  } finally {
    await page.unroute("**/api/package-info**").catch(() => {});
  }
}

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
});
const page = await context.newPage();

for (const entry of PAGES) {
  await shootPage(page, entry);
}

await browser.close();
console.log(`Done. Screenshots in ${outDir}`);
