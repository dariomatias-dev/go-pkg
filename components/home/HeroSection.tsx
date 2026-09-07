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
    <section className="relative border-b border-sky-600/30 bg-linear-to-b from-[#006680] to-[#00ADD8] px-6 py-16 text-white transition-colors duration-500 dark:border-[#30363d] dark:from-[#0d1117] dark:to-[#010409]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[24px_24px] opacity-10 dark:opacity-[0.03]" />
      </div>

      <div className="container-scale relative z-10 text-center">
        <div className="h-4" />

        <h1 className="font-display mx-auto mb-6 max-w-4xl text-4xl leading-none font-bold tracking-tight text-white sm:text-5xl md:text-6xl dark:text-[#f0f6fc]">
          Discover the best packages of{" "}
          <span className="text-cyan-200 dark:text-sky-400">Go (Golang)</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed font-light text-slate-100/90 sm:text-lg dark:text-[#8b949e]">
          Find trusted packages from the Official Go Proxy with real GitHub
          statistics, dependencies, and version history.
        </p>

        <div className="relative mx-auto flex max-w-2xl flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl sm:flex-row dark:border-[#30363d] dark:bg-[#0d1117]">
          <div className="relative flex flex-1 items-center px-4">
            <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400 dark:text-[#484f58]" />

            <input
              type="text"
              aria-label="Search by package path"
              placeholder="Search by package path (e.g. github.com/gin-gonic/gin, cobra)..."
              className="w-full bg-transparent py-3 pr-8 pl-8 font-sans text-sm text-slate-800 placeholder-slate-400 focus:ring-0 focus:outline-none sm:text-base dark:text-[#c9d1d9] dark:placeholder-[#484f58]"
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
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer rounded-full border-none bg-transparent p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-[#484f58] dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <button
            type="button"
            data-testid="hero-search-button"
            onClick={() => submit(query)}
            className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00ADD8] px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-[#007D9C] active:scale-95 sm:text-base dark:bg-sky-600 dark:hover:bg-sky-700"
          >
            <span>Search</span>

            <ArrowRight className="h-4 w-4" />
          </button>

          {showHistory && (
            <SearchHistoryDropdown
              size="lg"
              onSelect={(q) => {
                setQuery(q);
                submit(q);
              }}
              className="animate-in fade-in slide-in-from-top-2 absolute top-[calc(100%+8px)] right-0 left-0 z-50 rounded-xl border border-slate-200 bg-white text-left shadow-2xl duration-200 dark:border-[#30363d] dark:bg-[#161b22]"
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
              className="cursor-pointer rounded-full bg-white/10 px-3 py-1 transition-all hover:bg-white/20 dark:border dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#c9d1d9] dark:hover:bg-[#30363d]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
