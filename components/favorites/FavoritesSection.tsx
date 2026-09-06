"use client";

import { ArrowRight, BookOpen, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { PackageCard } from "@/components/package/card/PackageCard";
import { useFavorites } from "@/hooks/useFavorites";

export function FavoritesSection() {
  const router = useRouter();

  const { favorites } = useFavorites();

  return (
    <div className="flex-1 bg-white py-12 transition-colors duration-300 sm:py-20 dark:bg-[#0b0e14]">
      <div className="container-scale max-w-5xl space-y-12">
        <div className="flex flex-col justify-between gap-8 border-b border-slate-100 pb-10 md:flex-row md:items-end dark:border-[#30363d]/50">
          <div className="space-y-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700" />

              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase dark:text-slate-600">
                Local Storage Sync
              </span>

              {favorites.length > 0 && (
                <div className="animate-in fade-in inline-flex items-center rounded-full border border-[#00ADD8]/20 bg-[#00ADD8]/10 px-2 py-0.5 duration-500">
                  <span className="text-[10px] font-black text-[#00ADD8] tabular-nums dark:text-sky-400">
                    {favorites.length} PACKAGES
                  </span>
                </div>
              )}
            </div>

            <h1 className="font-display text-4xl leading-[0.9] font-black tracking-tight text-slate-950 sm:text-6xl dark:text-[#f0f6fc]">
              Saved <br />
              <span className="text-[#00ADD8]">Packages.</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed font-light text-slate-500 sm:text-lg dark:text-[#8b949e]">
              Your personal repository of Go packages. Access your favorite
              tools and libraries quickly from your browser.
            </p>
          </div>
        </div>

        <div className="relative min-h-100">
          {favorites.length === 0 ? (
            <div className="group animate-in fade-in zoom-in-95 relative mx-auto mt-10 max-w-2xl duration-500">
              <div className="absolute inset-0 rounded-[40px] bg-linear-to-r from-[#00ADD8]/10 to-sky-500/10 opacity-50 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white px-8 py-20 text-center shadow-sm dark:border-[#30363d] dark:bg-[#0d1117]">
                <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 shadow-inner dark:border-[#30363d] dark:bg-[#161b22]">
                  <BookOpen className="h-9 w-9 text-slate-300 dark:text-[#484f58]" />
                </div>

                <h3 className="font-display text-2xl font-black text-slate-900 dark:text-[#f0f6fc]">
                  No favorites yet
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed font-light text-slate-500 dark:text-[#8b949e]">
                  Explore the Go ecosystem to find high-quality frameworks and
                  libraries. Add them to your list for quick access.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    onClick={() => router.push("/search")}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-black px-8 py-3 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-black/10 transition-all active:scale-95 dark:bg-white dark:text-black dark:shadow-white/5"
                  >
                    <Search className="h-4 w-4" />
                    Browse Ecosystem
                  </button>

                  <button
                    onClick={() => router.push("/")}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 text-xs font-black tracking-widest text-slate-900 uppercase transition-all hover:bg-slate-50 dark:border-[#30363d] dark:bg-transparent dark:text-slate-400 dark:hover:bg-[#161b22]"
                  >
                    Go Home
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 grid grid-cols-1 gap-6 duration-700">
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
