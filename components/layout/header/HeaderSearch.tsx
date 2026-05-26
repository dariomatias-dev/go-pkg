"use client";

import { Search, X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SearchHistoryDropdown } from "@/components/common/SearchHistoryDropdown";
import { saveToHistory } from "@/lib/search-history";

interface HeaderSearchProps {
  mobile?: boolean;
  onSearch?: () => void;
}

export function HeaderSearch({ mobile, onSearch }: HeaderSearchProps) {
  const router = useRouter();

  const [searchVal, setSearchVal] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const submitSearch = (q: string) => {
    if (!q.trim()) return;

    saveToHistory(q.trim());
    setShowHistory(false);
    onSearch?.();

    router.push(`/search?q=${encodeURIComponent(q.trim())}` as Route);
  };

  return (
    <div
      className={`relative ${mobile ? "w-full mb-4 px-1" : "flex-1 max-w-md hidden md:block"}`}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          submitSearch(searchVal);
        }}
        className="w-full"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Pesquisar pacotes Go..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            className={`w-full border text-xs py-2 pl-8 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all ${
              mobile
                ? "bg-slate-100 dark:bg-[#0d1117] border-slate-200 dark:border-[#30363d] text-slate-800 dark:text-[#c9d1d9] placeholder-slate-400 dark:placeholder-[#484f58]"
                : "bg-[#005a71] dark:bg-[#0d1117] border-sky-400/30 dark:border-[#30363d] text-white dark:text-[#f0f6fc] placeholder-sky-200/60 dark:placeholder-[#484f58]"
            }`}
          />

          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
              mobile
                ? "text-slate-400 dark:text-[#8b949e]"
                : "text-sky-200/70 dark:text-[#8b949e]"
            }`}
          />

          {searchVal && (
            <button
              type="button"
              onClick={() => setSearchVal("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 border-none p-0.5 transition-colors cursor-pointer ${
                mobile
                  ? "text-slate-400 dark:text-[#8b949e]"
                  : "text-sky-200 dark:text-[#8b949e]"
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {showHistory && (
        <SearchHistoryDropdown
          size="sm"
          onSelect={submitSearch}
          className="absolute left-0 right-0 top-full mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200 z-120 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl shadow-xl"
        />
      )}
    </div>
  );
}
