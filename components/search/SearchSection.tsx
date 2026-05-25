"use client";

import { ChevronRight, HelpCircle, RefreshCw, Sparkles, X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Pagination } from "@/components/common/Pagination";
import { PackageCard } from "@/components/package/PackageCard";
import type {
  CuratedCategory,
  GoPackage,
  PackageSearchResponse,
  PopularPackageResponse,
} from "@/types";

interface SearchSectionProps {
  initialQuery?: string;
  initialCategory?: string;
  initialTag?: string;
}

const RESULTS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default function SearchSection({
  initialQuery = "",
  initialCategory = "",
  initialTag = "",
}: SearchSectionProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag] = useState(initialTag);
  const [semanticSearch, setSemanticSearch] = useState(false);
  const [results, setResults] = useState<GoPackage[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CuratedCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetch("/api/trending")
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
        controller.signal,
      );
    }, 150);

    return () => {
      clearTimeout(delay);

      controller.abort();
    };
  }, [query, category, tag, semanticSearch, currentPage, perPage]);

  const pushRoute = (q: string, cat: string, t: string) => {
    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    if (t) params.set("tag", t);

    router.push(`/search?${params.toString()}` as Route<`/search?${string}`>);
  };

  const selectCategory = (catId: string) => {
    const next = catId === category ? "" : catId;

    setCategory(next);
    setTag("");
    setCurrentPage(1);

    pushRoute(query, next, "");
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setTag("");
    setCurrentPage(1);

    router.push("/search");

    setResults([]);
    setTotalResults(0);
  };

  const hasFilter = !!(query || category || tag);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 lg:self-start">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-semibold text-sm text-slate-900">
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
            <div className="text-xs bg-[#E0F2FE] text-[#007D9C] p-2.5 rounded-lg border border-sky-100 flex items-center justify-between">
              <div className="truncate">
                <span className="font-semibold block text-[10px] uppercase text-sky-700">
                  Search Term
                </span>

                <span className="font-mono">&quot;{query}&quot;</span>
              </div>

              <button
                onClick={() => {
                  setQuery("");
                  setCurrentPage(1);
                  pushRoute("", category, tag);
                }}
                className="text-sky-800 font-bold hover:text-[#007D9C] ml-2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="bg-slate-50/50 rounded-xl p-3.5 border border-slate-200 space-y-2 select-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#00ADD8] animate-pulse" />
                Semantic Search (AI)
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={semanticSearch}
                  onChange={() => {
                    setSemanticSearch((v) => !v);
                    setCurrentPage(1);
                  }}
                  className="sr-only peer"
                />

                <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00ADD8]" />
              </label>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed font-light">
              Search by functionality (e.g. &quot;caching&quot;, &quot;fast
              routing&quot;) instead of exact names.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Categories
            </label>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setCategory("");
                  setCurrentPage(1);
                  pushRoute(query, "", tag);
                }}
                className={`w-full text-left text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${!category ? "bg-sky-50 text-[#007D9C] font-semibold" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <span>All Categories</span>

                <span className="bg-slate-200/70 text-slate-700 min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {categories.length || 12}
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${category === cat.id ? "bg-[#E0F2FE] text-[#007D9C] font-semibold" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  <span className="truncate pr-1">{cat.name}</span>

                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {tag && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Selected Tag
              </label>

              <div className="flex items-center justify-between bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg">
                <span className="text-xs font-mono">#{tag}</span>

                <button
                  onClick={() => {
                    setTag("");
                    setCurrentPage(1);
                    pushRoute(query, category, "");
                  }}
                  className="font-bold text-slate-500 hover:text-slate-800 px-1 cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="bg-linear-to-br from-indigo-50 to-sky-50 rounded-xl p-4 border border-sky-100/40 text-center">
            <p className="text-[11px] text-slate-500 leading-relaxed font-light">
              Search popular packages or enter a full Go module import path to
              load it on demand!
            </p>
          </div>
        </div>
      </aside>

      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white rounded-xl py-4 px-6 border border-slate-200/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            {loading ? (
              <span>Searching packages in the index...</span>
            ) : (
              <span>
                Found{" "}
                <span className="font-semibold text-[#00ADD8]">
                  {totalResults}
                </span>{" "}
                matching results
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 select-none">
            <span className="text-xs text-slate-500 font-medium">
              Per page:
            </span>

            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg py-1.5 px-3 font-semibold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-[#00ADD8]/20 focus:border-[#00ADD8] cursor-pointer transition-all"
            >
              {RESULTS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="w-full h-1 bg-cyan-100/50 rounded-full overflow-hidden relative">
            <div className="h-full bg-[#00ADD8] w-1/3 rounded-full animate-progress-slide absolute top-0 left-0" />
          </div>
        )}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 text-sm">
            {error}
          </div>
        ) : loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border border-slate-200/50 shadow-sm flex flex-col gap-5 animate-shimmer relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />

                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-3.5 w-16 bg-slate-100 rounded-full" />
                    <div className="h-5 w-1/3 bg-slate-100 rounded-md" />
                    <div className="h-3 w-1/2 bg-slate-50 rounded-sm" />
                  </div>
                </div>

                <div className="h-4 w-4/5 bg-slate-100/80 rounded-sm" />

                <div className="border-t border-slate-100/80 pt-4 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="h-4 w-20 bg-slate-100 rounded-md" />
                    <div className="h-4 w-16 bg-slate-100 rounded-md" />
                  </div>

                  <div className="h-4 w-14 bg-slate-100 rounded-md" />
                </div>
              </div>
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
                onPageChange={(page) => setCurrentPage(page)}
                isLoading={loading}
                itemCountInPage={results.length}
                label="results found"
              />
            )}
          </div>
        ) : hasFilter ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="font-semibold text-slate-900 text-lg">
              No packages match your search
            </h3>

            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
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
                    router.push(
                      `/package/${path.split("/").map(encodeURIComponent).join("/")}` as Route,
                    );
                  }}
                  className="bg-[#00ADD8] hover:bg-[#007D9C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resolve via Go Proxy
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            Search for a Go package to display matching repositories.
          </div>
        )}
      </div>
    </div>
  );
}
