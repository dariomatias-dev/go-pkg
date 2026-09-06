"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

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

  const [jumpIdx, setJumpIdx] = useState<number | null>(null);
  const [jumpVal, setJumpVal] = useState("");

  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  const go = (page: number) => {
    onPageChange(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openJump = (i: number) => {
    setJumpIdx(i);
    setJumpVal("");
  };

  const commitJump = () => {
    const n = parseInt(jumpVal, 10);

    if (!isNaN(n) && n >= 1 && n <= totalPages) go(n);

    setJumpIdx(null);
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200/70 bg-white p-3 font-sans shadow-sm transition-colors duration-300 select-none sm:p-4 lg:flex-row dark:border-[#30363d] dark:bg-[#161b22]">
      <div className="order-2 text-center text-xs font-medium text-slate-500 sm:text-sm lg:order-1 lg:text-left dark:text-[#8b949e]">
        Showing{" "}
        <span className="font-bold text-slate-800 dark:text-[#f0f6fc]">
          {Math.min(itemCountInPage, perPage)}
        </span>{" "}
        of{" "}
        <span className="font-bold text-[#007D9C] dark:text-sky-400">
          {totalResults}
        </span>{" "}
        {label}
      </div>

      <div className="order-1 flex w-full flex-wrap items-center justify-center gap-1 sm:w-auto sm:gap-1.5 lg:order-2">
        <button
          type="button"
          disabled={currentPage === 1 || isLoading}
          onClick={() => go(currentPage - 1)}
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 p-2 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:p-2.5 dark:border-[#30363d] dark:text-[#8b949e] dark:hover:bg-[#21262d] dark:hover:text-[#f0f6fc]"
        >
          <ChevronLeft className="h-4 w-4" />

          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1">
          {pages.map((p, i) =>
            p === "..." ? (
              jumpIdx === i ? (
                <input
                  key={`ellipsis-${i}`}
                  autoFocus
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpVal}
                  onChange={(e) => setJumpVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitJump();
                    if (e.key === "Escape") setJumpIdx(null);
                  }}
                  onBlur={() => setJumpIdx(null)}
                  className="h-8 w-14 [appearance:textfield] rounded-lg border border-[#00ADD8] bg-white px-1.5 text-center text-xs font-bold text-slate-800 outline-none sm:h-9 dark:border-sky-500 dark:bg-[#0d1117] dark:text-[#f0f6fc] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              ) : (
                <button
                  key={`ellipsis-${i}`}
                  type="button"
                  onClick={() => openJump(i)}
                  className={cn(
                    btnBase,
                    "border border-transparent tracking-wider text-slate-400 hover:border-slate-200 hover:bg-slate-50 hover:text-[#007D9C] dark:text-[#484f58] dark:hover:border-[#30363d] dark:hover:bg-[#21262d] dark:hover:text-sky-400",
                  )}
                  title="Jump to page"
                >
                  &hellip;
                </button>
              )
            ) : (
              <button
                type="button"
                key={p}
                onClick={() => go(p)}
                className={cn(
                  btnBase,
                  currentPage === p
                    ? "bg-[#00ADD8] text-white shadow-sm dark:bg-sky-600"
                    : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-[#c9d1d9] dark:hover:border-[#30363d] dark:hover:bg-[#21262d]",
                )}
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
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 p-2 text-xs font-semibold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:p-2.5 dark:border-[#30363d] dark:text-[#8b949e] dark:hover:bg-[#21262d] dark:hover:text-[#f0f6fc]"
        >
          <span className="hidden sm:inline">Next</span>

          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
