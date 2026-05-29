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
            onChange={onSortChange}
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
            onChange={(next) => onPerPageChange(Number(next))}
          />
        </div>
      </div>
    </div>
  );
}
