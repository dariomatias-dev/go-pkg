"use client";

import { ArrowRight, Search, X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SearchHistoryDropdown } from "@/components/common/SearchHistoryDropdown";
import { saveToHistory } from "@/lib/search-history";

const SUGGESTIONS = ["gin", "cobra", "zap", "gorm"];

export function HeroSection() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const submit = (q: string) => {
    const term = q.trim();

    if (!term) return;

    saveToHistory(term);
    setShowHistory(false);

    router.push(
      `/search?q=${encodeURIComponent(term)}` as Route<`/search?q=${string}`>,
    );
  };

  return (
    <section className="bg-linear-to-b from-[#007D9C] to-[#00ADD8] dark:from-[#0d1117] dark:to-[#010409] text-white py-16 px-6 relative border-b border-sky-600/30 dark:border-[#30363d] transition-colors duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[24px_24px]" />
      </div>

      <div className="container-scale text-center relative z-10">
        <div className="h-4" />

        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none text-white dark:text-[#f0f6fc] max-w-4xl mx-auto mb-6">
          Discover the best packages of{" "}
          <span className="text-cyan-200 dark:text-sky-400">Go (Golang)</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-100/90 dark:text-[#8b949e] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Find trusted modules from the Official Go Proxy with real GitHub
          statistics, dependencies, and version history.
        </p>

        <div className="max-w-2xl mx-auto bg-white dark:bg-[#0d1117] rounded-xl shadow-xl p-2 flex flex-col sm:flex-row gap-2 border border-slate-200 dark:border-[#30363d] relative">
          <div className="flex-1 flex items-center px-4 relative">
            <Search className="w-5 h-5 text-slate-400 dark:text-[#484f58] absolute left-4 pointer-events-none" />

            <input
              type="text"
              placeholder="Search by module path (e.g. github.com/gin-gonic/gin, cobra)..."
              className="w-full pl-8 pr-8 py-3 bg-transparent text-slate-800 dark:text-[#c9d1d9] placeholder-slate-400 dark:placeholder-[#484f58] font-sans text-sm sm:text-base focus:outline-none focus:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(query);
              }}
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#484f58] hover:text-slate-600 dark:hover:text-slate-300 bg-transparent border-none p-1 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => submit(query)}
            className="bg-[#00ADD8] dark:bg-sky-600 hover:bg-[#007D9C] dark:hover:bg-sky-700 text-white font-medium text-sm sm:text-base px-6 py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
          >
            <span>Search</span>

            <ArrowRight className="w-4 h-4" />
          </button>

          {showHistory && (
            <SearchHistoryDropdown
              size="lg"
              onSelect={(q) => {
                setQuery(q);
                submit(q);
              }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] text-left animate-in fade-in slide-in-from-top-2 duration-200 z-50 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl shadow-2xl"
            />
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-sky-100">
          <span className="font-semibold text-sky-200 dark:text-[#8b949e]">
            Search suggestions:
          </span>

          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="bg-white/10 dark:bg-[#21262d] hover:bg-white/20 dark:hover:bg-[#30363d] dark:text-[#c9d1d9] dark:border dark:border-[#30363d] px-3 py-1 rounded-full cursor-pointer transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
