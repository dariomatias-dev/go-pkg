"use client";

import { ChevronRight, HelpCircle, RefreshCw, Sparkles, X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PackageCardSkeleton } from "@/components/common/PackageCardSkeleton";
import { Pagination } from "@/components/common/Pagination";
import { PackageCard } from "@/components/package/card/PackageCard";
import { Select } from "@/components/common/select";
import { cn, encodeImportPath } from "@/lib/utils";
import type {
  CuratedCategory,
  GoPackage,
  PackageSearchResponse,
  PopularPackageResponse,
} from "@/types";

type SearchSort = "best" | "stars" | "updated" | "forks";

interface SearchSectionProps {
  initialQuery?: string;
  initialCategory?: string;
  initialTag?: string;
  initialPage?: number;
  initialPerPage?: number;
  initialSemantic?: boolean;
  initialSort?: SearchSort;
}

const RESULTS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
  { value: "stars", label: "Stars" },
  { value: "best", label: "Relevance" },
  { value: "updated", label: "Recently Updated" },
  { value: "forks", label: "Forks" },
];

export default function SearchSection({
  initialQuery = "",
  initialCategory = "",
  initialTag = "",
  initialPage = 1,
  initialPerPage = 10,
  initialSemantic = false,
  initialSort = "stars" as SearchSort,
}: SearchSectionProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag] = useState(initialTag);
  const [semanticSearch, setSemanticSearch] = useState(initialSemantic);
  const [results, setResults] = useState<GoPackage[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CuratedCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [sort, setSort] = useState<SearchSort>(initialSort);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch("/api/popular-package")
      .then((r) => r.json())
      .then((data: PopularPackageResponse) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => {});
  }, []);

  const runSearch = async (
    q: string,
    cat: string,
    t: string,
    page: number,
    limit: number,
    semantic: boolean,
    sortBy: SearchSort,
    signal?: AbortSignal,
  ) => {
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (q) params.set("q", q);
      if (cat) params.set("category", cat);
      if (t) params.set("tag", t);

      params.set("semantic", String(semantic));
      params.set("page", String(page));
      params.set("perPage", String(limit));
      params.set("sort", sortBy);

      const res = await fetch(`/api/search?${params.toString()}`, { signal });

      if (!res.ok) throw new Error("Failed to fetch results.");

      const data = (await res.json()) as PackageSearchResponse;

      setResults(data.results);
      setTotalResults(data.totalResults);
    } catch (err: unknown) {
      if ((err as { name?: string }).name === "AbortError") return;

      setError((err as Error).message);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const delay = setTimeout(() => {
      runSearch(
        query,
        category,
        tag,
        currentPage,
        perPage,
        semanticSearch,
        sort,
        controller.signal,
      );
    }, 150);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [query, category, tag, semanticSearch, currentPage, perPage, sort]);

  const pushRoute = (
    overrides: Partial<{
      q: string;
      cat: string;
      t: string;
      page: number;
      limit: number;
      semantic: boolean;
      sortBy: SearchSort;
    }> = {},
  ) => {
    const q = overrides.q !== undefined ? overrides.q : query;
    const cat = overrides.cat !== undefined ? overrides.cat : category;
    const t = overrides.t !== undefined ? overrides.t : tag;
    const page = overrides.page !== undefined ? overrides.page : currentPage;
    const limit = overrides.limit !== undefined ? overrides.limit : perPage;
    const sem =
      overrides.semantic !== undefined ? overrides.semantic : semanticSearch;
    const sortBy = overrides.sortBy !== undefined ? overrides.sortBy : sort;

    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    if (t) params.set("tag", t);
    if (page > 1) params.set("page", String(page));
    if (limit !== 10) params.set("perPage", String(limit));
    if (sem) params.set("semantic", "true");
    if (sortBy !== "stars") params.set("sort", sortBy);

    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ""}` as Route<`/search?${string}`>, {
      scroll: false,
    });
  };

  const selectCategory = (catId: string) => {
    const next = catId === category ? "" : catId;

    setCategory(next);
    setTag("");
    setCurrentPage(1);

    pushRoute({ cat: next, t: "", page: 1 });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setTag("");
    setCurrentPage(1);
    setPerPage(10);
    setSemanticSearch(false);
    setSort("stars");

    router.push("/search");

    setResults([]);
    setTotalResults(0);
  };

  const hasFilter = !!(query || category || tag);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 lg:self-start">
        <div className="bg-white dark:bg-[#161b22] rounded-xl p-5 border border-slate-200 dark:border-[#30363d] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#30363d]">
            <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-[#f0f6fc]">
              Active Filters
            </h3>

            {hasFilter && (
              <button
                onClick={clearFilters}
                className="text-[11px] font-medium text-rose-500 hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {query && (
            <div className="text-xs bg-[#E0F2FE] dark:bg-sky-950/30 text-[#007D9C] dark:text-sky-400 p-2.5 rounded-lg border border-sky-100 dark:border-sky-900/30 flex items-center justify-between">
              <div className="truncate">
                <span className="font-semibold block text-[10px] uppercase text-sky-700 dark:text-sky-500">
                  Search Term
                </span>

                <span className="font-mono">&quot;{query}&quot;</span>
              </div>

              <button
                onClick={() => {
                  setQuery("");
                  setCurrentPage(1);
                  pushRoute({ q: "", page: 1 });
                }}
                className="text-sky-800 dark:text-sky-300 font-bold hover:text-[#007D9C] dark:hover:text-sky-200 ml-2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="bg-slate-50/50 dark:bg-[#0d1117] rounded-xl p-3.5 border border-slate-200 dark:border-[#30363d] space-y-2 select-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-[#c9d1d9] flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#00ADD8] dark:text-sky-400 animate-pulse" />
                Semantic Search (AI)
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={semanticSearch}
                  onChange={() => {
                    const next = !semanticSearch;
                    setSemanticSearch(next);
                    setCurrentPage(1);
                    pushRoute({ semantic: next, page: 1 });
                  }}
                  className="sr-only peer"
                />

                <div className="w-9 h-5 bg-slate-300 dark:bg-[#30363d] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 dark:after:border-[#30363d] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00ADD8] dark:peer-checked:bg-sky-600" />
              </label>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-[#8b949e] leading-relaxed font-light">
              Search by functionality (e.g. &quot;caching&quot;, &quot;fast
              routing&quot;) instead of exact names.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-wider block">
              Categories
            </label>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setCategory("");
                  setCurrentPage(1);
                  pushRoute({ cat: "", page: 1 });
                }}
                className={cn(
                  "w-full text-left text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                  !category
                    ? "bg-sky-50 dark:bg-[#21262d] text-[#007D9C] dark:text-sky-400 font-semibold"
                    : "hover:bg-slate-50 dark:hover:bg-[#21262d] text-slate-600 dark:text-[#c9d1d9]",
                )}
              >
                <span>All Categories</span>

                <span className="bg-slate-200/70 dark:bg-[#30363d] text-slate-700 dark:text-[#c9d1d9] min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {categories.length || 12}
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className={cn(
                    "w-full text-left text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer",
                    category === cat.id
                      ? "bg-[#E0F2FE] dark:bg-[#21262d] text-[#007D9C] dark:text-sky-400 font-semibold"
                      : "hover:bg-slate-50 dark:hover:bg-[#21262d] text-slate-600 dark:text-[#c9d1d9]",
                  )}
                >
                  <span className="truncate pr-1">{cat.name}</span>

                  <ChevronRight className="w-3 h-3 text-slate-400 dark:text-[#484f58] shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {tag && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 dark:text-[#8b949e] uppercase tracking-wider block">
                Selected Tag
              </label>

              <div className="flex items-center justify-between bg-slate-100 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#c9d1d9] px-3 py-2 rounded-lg">
                <span className="text-xs font-mono">#{tag}</span>

                <button
                  onClick={() => {
                    setTag("");
                    setCurrentPage(1);
                    pushRoute({ t: "", page: 1 });
                  }}
                  className="font-bold text-slate-500 hover:text-slate-800 dark:hover:text-[#f0f6fc] px-1 cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="bg-linear-to-br from-indigo-50 to-sky-50 dark:from-[#0d1117] dark:to-[#0d1117] rounded-xl p-4 border border-sky-100/40 dark:border-[#30363d] text-center">
            <p className="text-[11px] text-slate-500 dark:text-[#8b949e] leading-relaxed font-light">
              Search popular packages or enter a full Go module import path to
              load it on demand!
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white dark:bg-[#161b22] rounded-xl py-4 px-6 border border-slate-200/70 dark:border-[#30363d] shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600 dark:text-[#8b949e] min-w-0">
            {loading ? (
              <span>Searching packages in the index...</span>
            ) : (
              <span>
                Found{" "}
                <span className="font-semibold text-[#00ADD8] dark:text-sky-400">
                  {totalResults}
                </span>{" "}
                matching results
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 select-none">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-[#8b949e] font-medium">
                Sort:
              </span>

              <Select
                value={sort}
                options={SORT_OPTIONS}
                onChange={(next) => {
                  setSort(next);
                  setCurrentPage(1);

                  pushRoute({ sortBy: next, page: 1 });
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-[#8b949e] font-medium">
                Per page:
              </span>

              <Select
                value={String(perPage)}
                options={RESULTS_PER_PAGE_OPTIONS.map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
                onChange={(next) => {
                  const n = Number(next);

                  setPerPage(n);
                  setCurrentPage(1);

                  pushRoute({ limit: n, page: 1 });
                }}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="w-full h-1 bg-cyan-100/50 dark:bg-sky-900/20 rounded-full overflow-hidden relative">
            <div className="h-full bg-[#00ADD8] dark:bg-sky-500 w-1/3 rounded-full animate-progress-slide absolute top-0 left-0" />
          </div>
        )}

        {error ? (
          <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-6 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((pkg) => (
              <PackageCard key={pkg.importPath} pkg={pkg} />
            ))}

            {totalResults > perPage && (
              <Pagination
                currentPage={currentPage}
                totalResults={totalResults}
                perPage={perPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  pushRoute({ page });
                }}
                isLoading={loading}
                itemCountInPage={results.length}
                label="results found"
              />
            )}
          </div>
        ) : hasFilter ? (
          <div className="bg-white dark:bg-[#161b22] rounded-xl p-12 text-center border border-slate-200 dark:border-[#30363d] shadow-sm">
            <div className="bg-slate-50 dark:bg-[#0d1117] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-slate-400 dark:text-[#484f58]" />
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-[#f0f6fc] text-lg">
              No packages match your search
            </h3>

            <p className="text-slate-500 dark:text-[#8b949e] text-sm max-w-sm mx-auto mt-2 leading-relaxed">
              &quot;{query}&quot; is not indexed locally. Try resolving it
              directly from the official Go Proxy?
            </p>

            {query && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    const path = query.includes("/")
                      ? query
                      : `github.com/${query}/${query}`;
                    router.push(`/package/${encodeImportPath(path)}` as Route);
                  }}
                  className="bg-[#00ADD8] dark:bg-sky-600 hover:bg-[#007D9C] dark:hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resolve via Go Proxy
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-[#30363d] bg-slate-50 dark:bg-[#0d1117] p-10 text-center text-slate-500 dark:text-[#8b949e]">
            Search for a Go package to display matching repositories.
          </div>
        )}
      </div>
    </div>
  );
}
