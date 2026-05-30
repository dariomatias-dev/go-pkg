"use client";

import { ArrowRight, BookOpen, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PackageCard } from "@/components/package/card/PackageCard";
import { useFavorites } from "@/hooks/useFavorites";

export function FavoritesSection() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0b0e14] py-12 sm:py-20 flex-1 transition-colors duration-300">
      <div className="container-scale max-w-5xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100 dark:border-[#30363d]/50">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />

              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
                Local Storage Sync
              </span>

              {!loading && favorites.length > 0 && (
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00ADD8]/10 border border-[#00ADD8]/20 animate-in fade-in duration-500">
                  <span className="text-[10px] font-black text-[#00ADD8] dark:text-sky-400 tabular-nums">
                    {favorites.length} PACKAGES
                  </span>
                </div>
              )}
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-950 dark:text-[#f0f6fc] tracking-tight leading-[0.9]">
              Saved <br />
              <span className="text-[#00ADD8]">Modules.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 dark:text-[#8b949e] font-light max-w-xl leading-relaxed">
              Your personal repository of Go packages. Access your favorite
              tools and libraries quickly from your browser.
            </p>
          </div>
        </div>

        <div className="relative min-h-100">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#00ADD8] animate-spin opacity-20" />
                <Loader2 className="absolute w-10 h-10 text-[#00ADD8] animate-spin animation-duration-[3s]" />
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Retrieving Packages
                </span>

                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-[#00ADD8] animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1 h-1 rounded-full bg-[#00ADD8] animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1 h-1 rounded-full bg-[#00ADD8] animate-bounce" />
                </div>
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="relative group max-w-2xl mx-auto mt-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="absolute inset-0 bg-linear-to-r from-[#00ADD8]/10 to-sky-500/10 rounded-[40px] blur-3xl opacity-50" />

              <div className="relative bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] py-20 px-8 rounded-[32px] text-center shadow-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

                <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-[#161b22] flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-[#30363d] shadow-inner">
                  <BookOpen className="w-9 h-9 text-slate-300 dark:text-[#484f58]" />
                </div>

                <h3 className="font-display font-black text-2xl text-slate-900 dark:text-[#f0f6fc]">
                  No favorites yet
                </h3>

                <p className="text-slate-500 dark:text-[#8b949e] text-sm mt-3 max-w-sm mx-auto leading-relaxed font-light">
                  Explore the Go ecosystem to find high-quality frameworks and
                  libraries. Add them to your list for quick access.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => router.push("/search")}
                    className="flex items-center gap-2 px-8 py-3 bg-black text-white dark:bg-white dark:text-black text-xs font-black rounded-xl transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/5 uppercase tracking-widest cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    Browse Ecosystem
                  </button>

                  <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-transparent text-slate-900 dark:text-slate-400 text-xs font-black rounded-xl transition-all border border-slate-200 dark:border-[#30363d] hover:bg-slate-50 dark:hover:bg-[#161b22] uppercase tracking-widest cursor-pointer"
                  >
                    Go Home
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {favorites.map((pkg, idx) => (
                <PackageCard key={pkg.importPath} pkg={pkg} index={idx + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
