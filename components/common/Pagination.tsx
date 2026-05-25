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

  const pageWindow = 4;
  let startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + pageWindow);

  if (endPage - startPage < pageWindow) {
    startPage = Math.max(1, endPage - pageWindow);
  }

  const pages: number[] = [];
  for (let p = startPage; p <= endPage; p++) {
    if (p >= 1 && p <= totalPages) pages.push(p);
  }

  const handlePageClick = (page: number) => {
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

      <div className="flex items-center gap-1 sm:gap-1.5 select-none order-1 lg:order-2 w-full sm:w-auto justify-center">
        <button
          type="button"
          disabled={currentPage === 1 || isLoading}
          onClick={() => handlePageClick(Math.max(1, currentPage - 1))}
          className="p-2 sm:p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 transition-all text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {startPage > 1 && (
            <>
              <button
                type="button"
                onClick={() => handlePageClick(1)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === 1 ? "bg-[#00ADD8] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}`}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="text-slate-400 px-0.5 sm:px-1 text-[10px] sm:text-xs">
                  ...
                </span>
              )}
            </>
          )}

          {pages.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => handlePageClick(p)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === p ? "bg-[#00ADD8] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}`}
            >
              {p}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="text-slate-400 px-0.5 sm:px-1 text-[10px] sm:text-xs">
                  ...
                </span>
              )}
              <button
                type="button"
                onClick={() => handlePageClick(totalPages)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === totalPages ? "bg-[#00ADD8] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"}`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}
          className="p-2 sm:p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-40 transition-all text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed shrink-0"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
