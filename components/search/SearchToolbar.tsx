"use client";

import { Select } from "@/components/common/select";

type SearchSort = "best" | "stars" | "updated" | "forks";

const RESULTS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const SORT_OPTIONS: { value: SearchSort; label: string }[] = [
  { value: "stars", label: "Stars" },
  { value: "best", label: "Relevance" },
  { value: "updated", label: "Recently Updated" },
  { value: "forks", label: "Forks" },
];

interface SearchToolbarProps {
  totalResults: number;
  loading: boolean;
  sort: SearchSort;
  perPage: number;
  onSortChange: (sort: SearchSort) => void;
  onPerPageChange: (perPage: number) => void;
}

export function SearchToolbar({
  totalResults,
  loading,
  sort,
  perPage,
  onSortChange,
  onPerPageChange,
}: SearchToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white px-6 py-4 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="min-w-0 text-sm text-slate-600 dark:text-[#8b949e]">
        {loading ? (
          <span>Searching packages in the index...</span>
        ) : (
          <span>
            Found{" "}
            <span className="font-semibold text-[#006680] dark:text-sky-400">
              {totalResults}
            </span>{" "}
            matching results
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-[#8b949e]">
            Sort:
          </span>

          <Select value={sort} options={SORT_OPTIONS} onChange={onSortChange} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-[#8b949e]">
            Per page:
          </span>

          <Select
            value={String(perPage)}
            options={RESULTS_PER_PAGE_OPTIONS.map((n) => ({
              value: String(n),
              label: String(n),
            }))}
            onChange={(next) => onPerPageChange(Number(next))}
          />
        </div>
      </div>
    </div>
  );
}
