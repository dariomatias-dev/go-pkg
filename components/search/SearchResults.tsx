"use client";

import { HelpCircle, RefreshCw } from "lucide-react";

import { PackageCardSkeleton } from "@/components/common/PackageCardSkeleton";
import { Pagination } from "@/components/common/Pagination";
import { PackageCard } from "@/components/package/card/PackageCard";
import type { GoPackage } from "@/types";

interface SearchResultsProps {
  loading: boolean;
  error: string | null;
  results: GoPackage[];
  totalResults: number;
  perPage: number;
  currentPage: number;
  query: string;
  hasFilter: boolean;
  onPageChange: (page: number) => void;
  onResolveProxy: () => void;
}

export function SearchResults({
  loading,
  error,
  results,
  totalResults,
  perPage,
  currentPage,
  query,
  hasFilter,
  onPageChange,
  onResolveProxy,
}: SearchResultsProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <PackageCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div className="space-y-4">
        {results.map((pkg) => (
          <PackageCard key={pkg.importPath} pkg={pkg} />
        ))}

        {totalResults > perPage && (
          <Pagination
            currentPage={currentPage}
            totalResults={totalResults}
            perPage={perPage}
            onPageChange={onPageChange}
            isLoading={loading}
            itemCountInPage={results.length}
            label="results found"
          />
        )}
      </div>
    );
  }

  if (hasFilter) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-[#0d1117]">
          <HelpCircle className="h-8 w-8 text-slate-400 dark:text-[#484f58]" />
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-[#f0f6fc]">
          No packages match your search
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-[#8b949e]">
          &quot;{query}&quot; is not indexed locally. Try resolving it directly
          from the official Go Proxy?
        </p>

        {query && (
          <div className="mt-6">
            <button
              onClick={onResolveProxy}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#00ADD8] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#007D9C] dark:bg-sky-600 dark:hover:bg-sky-700"
            >
              <RefreshCw className="h-4 w-4" />
              Resolve via Go Proxy
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#8b949e]">
      Search for a Go package to display matching repositories.
    </div>
  );
}
