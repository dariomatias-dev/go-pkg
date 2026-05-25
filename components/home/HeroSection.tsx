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
    <section className="bg-linear-to-b from-[#007D9C] to-[#00ADD8] text-white py-16 px-6 relative border-b border-sky-600/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[24px_24px]" />
      </div>

      <div className="container-scale text-center relative z-10">
        <div className="h-4" />
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none text-white max-w-4xl mx-auto mb-6">
          Discover the best packages of{" "}
          <span className="text-cyan-200">Go (Golang)</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-100/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Find trusted modules from the Official Go Proxy with real GitHub
          statistics, dependencies, and version history.
        </p>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-2 flex flex-col sm:flex-row gap-2 border border-slate-200 relative">
          <div className="flex-1 flex items-center px-4 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by module path (e.g. github.com/gin-gonic/gin, cobra)..."
              className="w-full pl-8 pr-8 py-3 text-slate-800 placeholder-slate-400 font-sans text-sm sm:text-base focus:outline-none focus:ring-0"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none p-1 transition-colors cursor-pointer rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => submit(query)}
            className="bg-[#00ADD8] hover:bg-[#007D9C] text-white font-medium text-sm sm:text-base px-6 py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
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
              className="absolute left-2 right-2 top-full mt-2 text-left animate-fade-in"
            />
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-sky-100">
          <span className="font-semibold text-sky-200">
            Search suggestions:
          </span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => submit(s)}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full cursor-pointer transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
