export interface GoPackage {
  name: string;
  modulePath: string;
  description: string;
  stars: number;
  forks: number;
  license: string;
  latestVersion: string;
  versions?: string[];
  readme?: string;
  category: string;
  tags: string[];
  author: string;
  githubUrl?: string;
  goVersion?: string;
  publishedAt: string;
  dependenciesCount?: number;
  importsCount?: number;
  similarityScore?: number;
}

export interface PackageSearchResponse {
  results: GoPackage[];
  totalResults: number;
}

export interface PackageDetailResponse {
  pkg: GoPackage;
  goMod?: string;
  isCustom?: boolean;
}
