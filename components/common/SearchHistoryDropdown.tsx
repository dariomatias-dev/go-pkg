"use client";

import { Clock, X } from "lucide-react";
import { useState } from "react";

import {
  clearHistory,
  loadHistory,
  removeFromHistory,
} from "@/lib/search-history";

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
      className={`bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 overflow-hidden z-200 ${sm ? "text-xs" : "text-sm"} ${className ?? ""}`}
    >
      <div
        className={`bg-slate-50 border-b border-slate-100 flex items-center justify-between ${sm ? "p-2.5" : "px-4 py-3"}`}
      >
        <span
          className={`font-bold text-slate-500 ${sm ? "tracking-tighter text-[10px]" : "text-xs"}`}
        >
          Recent Searches
        </span>

        <button
          onMouseDown={() => {
            clearHistory();
            setHistory([]);
          }}
          className={`text-slate-400 hover:text-rose-500 font-bold transition-colors border-none bg-transparent outline-none cursor-pointer ${sm ? "text-[10px]" : "text-xs hover:underline"}`}
        >
          Clear all
        </button>
      </div>

      <div className={`overflow-y-auto ${sm ? "max-h-52" : "max-h-60"}`}>
        {history.map((q, idx) => (
          <div
            key={idx}
            onMouseDown={() => onSelect(q)}
            className={`flex items-center justify-between cursor-pointer transition-colors border-b border-slate-50 last:border-none ${sm ? "px-4 py-2.5 hover:bg-slate-100" : "px-4 py-3 hover:bg-slate-50/70"}`}
          >
            <div className="flex items-center space-x-3 truncate">
              <Clock
                className={`text-slate-400 shrink-0 ${sm ? "w-3.5 h-3.5" : "w-4 h-4"}`}
              />
              <span className="truncate font-medium text-slate-700">{q}</span>
            </div>

            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setHistory(removeFromHistory(q));
              }}
              className={`text-slate-400 hover:text-rose-500 border-none bg-transparent cursor-pointer transition-colors ${sm ? "text-slate-300 p-1 rounded-md hover:bg-slate-200" : "p-1.5 rounded-lg hover:bg-slate-100"}`}
            >
              <X className={sm ? "w-3 h-3" : "w-4 h-4"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
