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
    <div className="bg-white rounded-xl border border-slate-200/70 p-3 sm:p-4 mt-6 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm select-none font-sans">
      <div className="text-xs sm:text-sm text-slate-500 font-medium text-center lg:text-left order-2 lg:order-1">
        Showing{" "}
        <span className="text-slate-800 font-bold">
          {Math.min(itemCountInPage, perPage)}
        </span>{" "}
        of <span className="text-[#007D9C] font-bold">{totalResults}</span>{" "}
        {label}
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 order-1 lg:order-2 w-full sm:w-auto justify-center flex-wrap">
        <button
          type="button"
          disabled={currentPage === 1 || isLoading}
          onClick={() => go(currentPage - 1)}
          className="p-2 sm:p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 transition-all text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed shrink-0"
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
                className={`${btnBase} text-slate-400 hover:text-[#007D9C] hover:bg-slate-50 border border-transparent hover:border-slate-200 tracking-wider`}
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
                    ? "bg-[#00ADD8] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
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
          className="p-2 sm:p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 transition-all text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed shrink-0"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
