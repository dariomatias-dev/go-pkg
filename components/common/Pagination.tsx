"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  perPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  itemCountInPage: number;
  label: string;
}

function buildPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(2, current - 2);
  const right = Math.min(total - 1, current + 2);
  const pages: (number | "...")[] = [1];

  if (left > 2) pages.push("...");

  for (let p = left; p <= right; p++) pages.push(p);

  if (right < total - 1) pages.push("...");

  pages.push(total);

  return pages;
}

const btnBase =
  "h-8 sm:h-9 min-w-8 sm:min-w-9 px-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center";

export function Pagination({
  currentPage,
  totalResults,
  perPage,
  onPageChange,
  isLoading = false,
  itemCountInPage,
  label,
}: PaginationProps) {
  const totalPages = Math.ceil(totalResults / perPage);

  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  const go = (page: number) => {
    onPageChange(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200/70 dark:border-[#30363d] p-3 sm:p-4 mt-6 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm select-none font-sans transition-colors duration-300">
      <div className="text-xs sm:text-sm text-slate-500 dark:text-[#8b949e] font-medium text-center lg:text-left order-2 lg:order-1">
        Showing{" "}
        <span className="text-slate-800 dark:text-[#f0f6fc] font-bold">
          {Math.min(itemCountInPage, perPage)}
        </span>{" "}
        of{" "}
        <span className="text-[#007D9C] dark:text-sky-400 font-bold">
          {totalResults}
        </span>{" "}
        {label}
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 order-1 lg:order-2 w-full sm:w-auto justify-center flex-wrap">
        <button
          type="button"
          disabled={currentPage === 1 || isLoading}
          onClick={() => go(currentPage - 1)}
          className="p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-[#30363d] text-slate-500 dark:text-[#8b949e] hover:text-slate-800 dark:hover:text-[#f0f6fc] hover:bg-slate-50 dark:hover:bg-[#21262d] disabled:opacity-40 transition-all text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />

          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center">
          {pages.map((p, i) =>
            p === "..." ? (
              <button
                key={`ellipsis-${i}`}
                type="button"
                onClick={() => {
                  const prev = pages[i - 1];
                  const next = pages[i + 1];
                  if (typeof prev === "number" && typeof next === "number") {
                    go(Math.round((prev + next) / 2));
                  }
                }}
                className={`${btnBase} text-slate-400 dark:text-[#484f58] hover:text-[#007D9C] dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-[#21262d] border border-transparent hover:border-slate-200 dark:hover:border-[#30363d] tracking-wider`}
                title="Jump to middle"
              >
                &hellip;
              </button>
            ) : (
              <button
                type="button"
                key={p}
                onClick={() => go(p)}
                className={`${btnBase} ${
                  currentPage === p
                    ? "bg-[#00ADD8] dark:bg-sky-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#21262d] border border-transparent hover:border-slate-200 dark:hover:border-[#30363d]"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => go(currentPage + 1)}
          className="p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-[#30363d] text-slate-500 dark:text-[#8b949e] hover:text-slate-800 dark:hover:text-[#f0f6fc] hover:bg-slate-50 dark:hover:bg-[#21262d] disabled:opacity-40 transition-all text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed shrink-0"
        >
          <span className="hidden sm:inline">Next</span>

          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
