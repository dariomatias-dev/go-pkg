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
        "bg-white dark:bg-[#161b22] rounded-xl shadow-2xl border border-slate-200 dark:border-[#30363d] text-slate-800 dark:text-[#c9d1d9] overflow-hidden z-200",
        sm ? "text-xs" : "text-sm",
        className,
      )}
    >
      <div
        className={cn(
          "bg-slate-50 dark:bg-[#0d1117] border-b border-slate-100 dark:border-[#30363d] flex items-center justify-between",
          sm ? "p-2.5" : "px-4 py-3",
        )}
      >
        <span
          className={cn(
            "font-bold text-slate-500 dark:text-[#8b949e]",
            sm ? "tracking-tighter text-[10px]" : "text-xs",
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
            "text-slate-400 dark:text-[#484f58] hover:text-rose-500 dark:hover:text-rose-400 font-bold transition-colors border-none bg-transparent outline-none cursor-pointer",
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
              "flex items-center justify-between cursor-pointer transition-colors border-b border-slate-50 dark:border-[#30363d]/50 last:border-none",
              sm
                ? "px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-[#21262d]"
                : "px-4 py-3 hover:bg-slate-50/70 dark:hover:bg-[#21262d]",
            )}
          >
            <div className="flex items-center space-x-3 truncate">
              <Clock
                className={cn(
                  "text-slate-400 dark:text-[#484f58] shrink-0",
                  sm ? "w-3.5 h-3.5" : "w-4 h-4",
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
                "text-slate-400 dark:text-[#484f58] hover:text-rose-500 dark:hover:text-rose-400 border-none bg-transparent cursor-pointer transition-colors",
                sm
                  ? "text-slate-300 dark:text-[#30363d] p-1 rounded-md hover:bg-slate-200 dark:hover:bg-[#30363d]"
                  : "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#30363d]",
              )}
            >
              <X className={sm ? "w-3 h-3" : "w-4 h-4"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
