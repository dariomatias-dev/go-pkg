import type { CuratedCategory } from "./curated-category";

export interface PopularPackage {
  importPath: string;
  name: string;
  description: string;
  stars: number;
  trendScore: number;
  change: string;
  category: string;
  tags: string[];
  githubUrl?: string;
  forks?: number;
  license?: string;
  latestVersion?: string;
  author?: string;
  publishedAt?: string;
  dependenciesCount?: number;
  similarityScore?: number;
}

export interface PopularPackageResponse {
  packages: PopularPackage[];
  categories: CuratedCategory[];
  popularTags: string[];
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
}
