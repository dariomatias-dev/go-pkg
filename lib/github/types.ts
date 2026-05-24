export interface GitHubRepo {
  full_name: string;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  license: { spdx_id: string; name: string } | null;
  topics: string[];
  owner: { login: string } | null;
  html_url: string;
  updated_at: string | null;
  pushed_at: string | null;
}

export interface GitHubSearchResponse {
  items: GitHubRepo[];
  total_count: number;
}

export interface GoProxyLatest {
  Version?: string;
  Time?: string;
}
