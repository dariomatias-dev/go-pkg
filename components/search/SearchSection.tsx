"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SearchResults } from "@/components/search/SearchResults";
import { SearchSidebar } from "@/components/search/SearchSidebar";
import { SearchToolbar } from "@/components/search/SearchToolbar";
import { encodeImportPath } from "@/lib/utils";
import type {
  CuratedCategory,
  GoPackage,
  PackageSearchResponse,

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
  initialCategories?: CuratedCategory[];
}

export default function SearchSection({
  initialQuery = "",
  initialCategory = "",
  initialTag = "",
  initialPage = 1,
  initialPerPage = 10,
  initialSemantic = false,
  initialSort = "stars" as SearchSort,
  initialCategories = [],
}: SearchSectionProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag] = useState(initialTag);
  const [semanticSearch, setSemanticSearch] = useState(initialSemantic);
  const [results, setResults] = useState<GoPackage[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories] = useState<CuratedCategory[]>(initialCategories);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [sort, setSort] = useState<SearchSort>(initialSort);

  useEffect(() => {
    window.scrollTo(0, 0);
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

      setResults(data.results ?? []);
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

  const hasFilter = !!(query || category || tag || semanticSearch);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 lg:self-start">
        <SearchSidebar
          category={category}
          tag={tag}
          semanticSearch={semanticSearch}
          categories={categories}
          hasFilter={hasFilter}
          onSemanticChange={(val) => {
            setSemanticSearch(val);
            setCurrentPage(1);

            pushRoute({ semantic: val, page: 1 });
          }}
          onCategoryChange={(catId) => {
            const next = catId === category ? "" : catId;

            setCategory(next);
            setTag("");
            setCurrentPage(1);

            pushRoute({ cat: next, t: "", page: 1 });
          }}
          onTagClear={() => {
            setTag("");
            setCurrentPage(1);

            pushRoute({ t: "", page: 1 });
          }}
          onClearAll={() => {
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
          }}
        />
      </aside>

      <div className="lg:col-span-3 space-y-6">
        <SearchToolbar
          totalResults={totalResults}
          loading={loading}
          sort={sort}
          perPage={perPage}
          onSortChange={(next) => {
            setSort(next);
            setCurrentPage(1);

            pushRoute({ sortBy: next, page: 1 });
          }}
          onPerPageChange={(n) => {
            setPerPage(n);
            setCurrentPage(1);

            pushRoute({ limit: n, page: 1 });
          }}
        />

        {loading && (
          <div className="w-full h-1 bg-cyan-100/50 dark:bg-sky-900/20 rounded-full overflow-hidden relative">
            <div className="h-full bg-[#00ADD8] dark:bg-sky-500 w-1/3 rounded-full animate-progress-slide absolute top-0 left-0" />
          </div>
        )}

        <SearchResults
          loading={loading}
          error={error}
          results={results}
          totalResults={totalResults}
          perPage={perPage}
          currentPage={currentPage}
          query={query}
          hasFilter={hasFilter}
          onPageChange={(page) => {
            setCurrentPage(page);

            pushRoute({ page });
          }}
          onResolveProxy={() => {
            const path = query.includes("/")
              ? query
              : `github.com/${query}/${query}`;

            router.push(`/package/${encodeImportPath(path)}` as Route);
          }}
        />
      </div>
    </div>
  );
}
