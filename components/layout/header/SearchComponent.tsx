"use client";

import { Clock, Search, X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchComponentProps {
  mobile?: boolean;
  onSearch?: () => void;
}

export default function SearchComponent({ mobile, onSearch }: SearchComponentProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory] = useState(["gin", "fiber"]);

  const submitSearch = (q: string) => {
    if (!q.trim()) return;
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
            className={`w-full border text-xs py-2 pl-8 pr-8 rounded-full focus:outline-none focus:ring-1 focus:ring-go-accent transition-all ${
              mobile
                ? "bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400"
                : "bg-[#005a71] border-sky-400/30 text-white placeholder-sky-200/60"
            }`}
          />

          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
              mobile ? "text-slate-400" : "text-sky-200/70"
            }`}
          />

          {searchVal && (
            <button
              type="button"
              onClick={() => setSearchVal("")}
              className={`absolute right-3 top-1/2 -translate-y-1/2 border-none p-0.5 transition-colors cursor-pointer ${
                mobile ? "text-slate-400" : "text-sky-200"
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {showHistory && searchHistory.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 z-150 text-slate-800 text-xs overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-slate-500 tracking-tighter text-[10px]">
              Recent Searches
            </span>

            <button
              onMouseDown={() => {}}
              className="text-[10px] text-slate-400 hover:text-rose-500 font-bold transition-colors border-none bg-transparent outline-none cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {searchHistory.map((q, idx) => (
              <div
                key={idx}
                onMouseDown={() => submitSearch(q)}
                className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-50 last:border-none"
              >
                <div className="flex items-center space-x-3 truncate">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                  <span className="truncate font-medium text-slate-700">{q}</span>
                </div>

                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-slate-300 hover:text-rose-500 p-1 rounded-md hover:bg-slate-200 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
