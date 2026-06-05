"use client";

import { ArrowRight, Heart, HeartOff, Loader2, TrendingUp } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PackageCardSkeleton } from "@/components/common/PackageCardSkeleton";
import { RecentPackages } from "@/components/home/RecentPackages";
import { PackageCard } from "@/components/package/card/PackageCard";
import { useFavorites } from "@/hooks/useFavorites";
import { encodeImportPath } from "@/lib/utils";
import type { PopularPackage, PopularPackageResponse } from "@/types";

const PER_PAGE = 4;
const MAX_PAGES = 10;

async function fetchPage(
  page: number,
  perPage: number = PER_PAGE,
): Promise<PopularPackageResponse> {
  const res = await fetch(
    `/api/popular-package?page=${page}&perPage=${perPage}`,
  );

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json() as Promise<PopularPackageResponse>;
}

export function PopularPackageSection() {
  const router = useRouter();
  const { favorites, removeFavorite } = useFavorites();

  const [packages, setPackages] = useState<PopularPackage[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const urlPage = Math.min(
      MAX_PAGES,
      Math.max(
        1,
        Number(new URLSearchParams(window.location.search).get("page") || 1),
      ),
    );
    const count = urlPage * PER_PAGE;

    fetchPage(1, count)
      .then((data) => {
        setPackages(data.packages ?? []);
        setPopularTags(data.popularTags ?? []);
        setHasMore(data.hasMore);
        setPage(Math.ceil((data.packages?.length ?? PER_PAGE) / PER_PAGE));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;

    setLoadingMore(true);

    fetchPage(nextPage)
      .then((data) => {
        setPackages((prev) => [...prev, ...(data.packages ?? [])]);
        setHasMore(data.hasMore);
        setPage(nextPage);
        router.replace(`?page=${nextPage}`, { scroll: false });
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  return (
    <section className="py-12 bg-slate-50/50 dark:bg-black flex-1 border-t border-slate-100 dark:border-[#30363d] transition-colors duration-300">
      <div className="container-scale grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-slate-200/60 dark:border-[#30363d] pb-3 flex items-center justify-between">
            <h3 className="font-display font-medium text-lg text-slate-900 dark:text-[#f0f6fc] flex items-center gap-2 select-none">
              <TrendingUp className="w-5 h-5 text-[#007D9C] dark:text-sky-400" />
              Popular Packages
            </h3>

            <button
              type="button"
              onClick={() => router.push("/popular")}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#007D9C] dark:text-sky-400 hover:text-[#005F77] dark:hover:text-sky-300 transition-colors cursor-pointer font-sans"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: PER_PAGE }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg, i) => (
                <PackageCard key={pkg.importPath} pkg={pkg} index={i + 1} />
              ))}

              {hasMore && (
                <div className="flex justify-center pt-2 select-none">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-[#21262d] hover:bg-slate-50 dark:hover:bg-[#30363d] border border-slate-200 dark:border-[#30363d] text-[#007D9C] dark:text-sky-400 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer font-sans disabled:opacity-60"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <RecentPackages />

          <div className="bg-white dark:bg-[#161b22] rounded-xl p-5 border border-slate-200/60 dark:border-[#30363d] shadow-sm">
            <h3 className="font-display font-semibold text-slate-900 dark:text-[#f0f6fc] text-sm tracking-tight border-b border-slate-100 dark:border-[#30363d] pb-3 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Your Favorites ({favorites.length})
              </span>
            </h3>

            {favorites.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400 dark:text-[#8b949e]">
                  No saved packages.
                </p>

                <p className="text-[10px] text-slate-400/85 dark:text-[#8b949e]/60 mt-1">
                  Click the heart on package cards to save them.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {favorites.map((pkg) => (
                  <div
                    key={pkg.importPath}
                    onClick={() => {
                      router.push(
                        `/package/${encodeImportPath(pkg.importPath)}` as Route<`/package/${string}`>,
                      );
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#21262d] border border-slate-100 dark:border-[#30363d] hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-semibold text-slate-800 dark:text-[#c9d1d9] group-hover:text-[#00ADD8] dark:group-hover:text-sky-400 transition-colors truncate">
                        {pkg.importPath.split("/").pop()}
                      </p>

                      <p className="text-[10px] font-mono text-slate-400 dark:text-[#8b949e] truncate">
                        {pkg.importPath}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(pkg.importPath);
                      }}
                      className="text-slate-300 dark:text-[#484f58] hover:text-rose-500 dark:hover:text-rose-400 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                    >
                      <HeartOff className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#161b22] rounded-xl p-5 border border-slate-200/60 dark:border-[#30363d] shadow-sm">
            <h3 className="font-display font-semibold text-slate-900 dark:text-[#f0f6fc] text-sm tracking-tight border-b border-slate-100 dark:border-[#30363d] pb-3 mb-4">
              Featured Tags
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="bg-slate-100/80 dark:bg-[#21262d] text-transparent h-6 w-14 rounded-md animate-shimmer relative overflow-hidden inline-block"
                    />
                  ))}
                </>
              ) : (
                popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/search?tag=${encodeURIComponent(tag)}` as Route<`/search?tag=${string}`>,
                      )
                    }
                    className="bg-slate-50 dark:bg-[#21262d] hover:bg-[#E0F2FE] dark:hover:bg-[#30363d] hover:text-[#007D9C] dark:hover:text-white text-slate-600 dark:text-[#c9d1d9] text-xs px-2.5 py-1 rounded transition-colors border border-slate-100 dark:border-[#30363d] cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
