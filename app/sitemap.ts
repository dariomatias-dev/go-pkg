import type { MetadataRoute } from "next";

import { CURATED_CATEGORIES } from "@/lib/curated-categories";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: new URL("/", SITE_URL).toString(), priority: 1 },
    { url: new URL("/search", SITE_URL).toString(), priority: 0.6 },
    { url: new URL("/popular", SITE_URL).toString(), priority: 0.8 },
    { url: new URL("/compare", SITE_URL).toString(), priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CURATED_CATEGORIES.map(
    (category) => ({
      url: new URL(
        `/search?category=${encodeURIComponent(category.id)}`,
        SITE_URL,
      ).toString(),
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...categoryRoutes];
}
