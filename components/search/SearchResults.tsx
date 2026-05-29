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
      <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-6 text-red-700 dark:text-red-400 text-sm">
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
      <div className="bg-white dark:bg-[#161b22] rounded-xl p-12 text-center border border-slate-200 dark:border-[#30363d] shadow-sm">
        <div className="bg-slate-50 dark:bg-[#0d1117] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-slate-400 dark:text-[#484f58]" />
        </div>

        <h3 className="font-semibold text-slate-900 dark:text-[#f0f6fc] text-lg">
          No packages match your search
        </h3>

        <p className="text-slate-500 dark:text-[#8b949e] text-sm max-w-sm mx-auto mt-2 leading-relaxed">
          &quot;{query}&quot; is not indexed locally. Try resolving it directly
          from the official Go Proxy?
        </p>

        {query && (
          <div className="mt-6">
            <button
              onClick={onResolveProxy}
              className="bg-[#00ADD8] dark:bg-sky-600 hover:bg-[#007D9C] dark:hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Resolve via Go Proxy
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#30363d] bg-slate-50 dark:bg-[#0d1117] p-10 text-center text-slate-500 dark:text-[#8b949e]">
      Search for a Go package to display matching repositories.
    </div>
  );
}
