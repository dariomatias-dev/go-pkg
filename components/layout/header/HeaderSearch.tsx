"use client";

import { Search, X } from "lucide-react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { SearchHistoryDropdown } from "@/components/common/SearchHistoryDropdown";
import { saveToHistory } from "@/lib/search-history";
import { cn } from "@/lib/utils";

interface HeaderSearchProps {
  mobile?: boolean;
  onSearch?: () => void;
}

export function HeaderSearch({ mobile, onSearch }: HeaderSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const [inputQuery, setInputQuery] = useState(urlQuery);
  const [syncedUrl, setSyncedUrl] = useState(urlQuery);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (syncedUrl !== urlQuery) {
    setSyncedUrl(urlQuery);
    setInputQuery(urlQuery);
  }

  const submitSearch = (q: string) => {
    if (!q.trim()) return;

    saveToHistory(q.trim());
    setShowHistory(false);

    inputRef.current?.blur();

    onSearch?.();

    router.push(`/search?q=${encodeURIComponent(q.trim())}` as Route);
  };

  return (
    <div
      className={cn(
        "relative",
        mobile ? "mb-4 w-full px-1" : "hidden max-w-md flex-1 md:block",
      )}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch(inputQuery);
        }}
        className="w-full"
      >
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Go packages..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            className={cn(
              "w-full rounded-full border py-2 pr-8 pl-8 text-xs transition-all focus:ring-1 focus:ring-sky-500 focus:outline-none",
              mobile
                ? "border-slate-200 bg-slate-100 text-slate-800 placeholder-slate-400 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#c9d1d9] dark:placeholder-[#484f58]"
                : "border-sky-400/30 bg-[#005a71] text-white placeholder-sky-200/60 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#f0f6fc] dark:placeholder-[#484f58]",
            )}
          />

          <Search
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2",
              mobile
                ? "text-slate-400 dark:text-[#8b949e]"
                : "text-sky-200/70 dark:text-[#8b949e]",
            )}
          />

          {inputQuery && (
            <button
              type="button"
              onClick={() => setInputQuery("")}
              className={cn(
                "absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-none p-0.5 transition-colors",
                mobile
                  ? "text-slate-400 dark:text-[#8b949e]"
                  : "text-sky-200 dark:text-[#8b949e]",
              )}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>

      {showHistory && (
        <SearchHistoryDropdown
          size="sm"
          onSelect={submitSearch}
          className="animate-in fade-in slide-in-from-top-1 absolute top-full right-0 left-0 z-120 mt-1.5 rounded-xl border border-slate-200 bg-white shadow-xl duration-200 dark:border-[#30363d] dark:bg-[#161b22]"
        />
      )}
    </div>
  );
}
