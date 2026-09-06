"use client";

import { Clock, X } from "lucide-react";
import { useState } from "react";

import {
  clearHistory,
  loadHistory,
  removeFromHistory,
} from "@/lib/search-history";
import { cn } from "@/lib/utils";

interface SearchHistoryDropdownProps {
  onSelect: (q: string) => void;
  size?: "sm" | "lg";
  className?: string;
}

export function SearchHistoryDropdown({
  onSelect,
  size = "sm",
  className,
}: SearchHistoryDropdownProps) {
  const [history, setHistory] = useState<string[]>(loadHistory);

  if (history.length === 0) return null;

  const sm = size === "sm";

  return (
    <div
      className={cn(
        "z-200 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-2xl dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#c9d1d9]",
        sm ? "text-xs" : "text-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b border-slate-100 bg-slate-50 dark:border-[#30363d] dark:bg-[#0d1117]",
          sm ? "p-2.5" : "px-4 py-3",
        )}
      >
        <span
          className={cn(
            "font-bold text-slate-500 dark:text-[#8b949e]",
            sm ? "text-[10px] tracking-tighter" : "text-xs",
          )}
        >
          Recent Searches
        </span>

        <button
          onMouseDown={() => {
            clearHistory();
            setHistory([]);
          }}
          className={cn(
            "cursor-pointer border-none bg-transparent font-bold text-slate-400 transition-colors outline-none hover:text-rose-500 dark:text-[#484f58] dark:hover:text-rose-400",
            sm ? "text-[10px]" : "text-xs hover:underline",
          )}
        >
          Clear all
        </button>
      </div>

      <div className={cn("overflow-y-auto", sm ? "max-h-52" : "max-h-60")}>
        {history.map((q, idx) => (
          <div
            key={idx}
            onMouseDown={() => onSelect(q)}
            className={cn(
              "flex cursor-pointer items-center justify-between border-b border-slate-50 transition-colors last:border-none dark:border-[#30363d]/50",
              sm
                ? "px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-[#21262d]"
                : "px-4 py-3 hover:bg-slate-50/70 dark:hover:bg-[#21262d]",
            )}
          >
            <div className="flex items-center space-x-3 truncate">
              <Clock
                className={cn(
                  "shrink-0 text-slate-400 dark:text-[#484f58]",
                  sm ? "h-3.5 w-3.5" : "h-4 w-4",
                )}
              />

              <span className="truncate font-medium text-slate-700 dark:text-[#c9d1d9]">
                {q}
              </span>
            </div>

            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setHistory(removeFromHistory(q));
              }}
              className={cn(
                "cursor-pointer border-none bg-transparent text-slate-400 transition-colors hover:text-rose-500 dark:text-[#484f58] dark:hover:text-rose-400",
                sm
                  ? "rounded-md p-1 text-slate-300 hover:bg-slate-200 dark:text-[#30363d] dark:hover:bg-[#30363d]"
                  : "rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-[#30363d]",
              )}
            >
              <X className={sm ? "h-3 w-3" : "h-4 w-4"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
