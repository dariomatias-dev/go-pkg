"use client";

import { ArrowRight, Heart, HeartOff, Loader2, TrendingUp } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PackageCard } from "@/components/package/PackageCard";
import { PackageCardSkeleton } from "@/components/common/PackageCardSkeleton";
import { useFavorites } from "@/hooks/useFavorites";
import type { PopularPackage, PopularPackageResponse } from "@/types";

const PER_PAGE = 4;

async function fetchPage(page: number): Promise<PopularPackageResponse> {
  const res = await fetch(
    `/api/popular-package?page=${page}&perPage=${PER_PAGE}`,
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
    fetchPage(1)
      .then((data) => {
        setPackages(data.packages ?? []);
        setPopularTags(data.popularTags ?? []);
        setHasMore(data.hasMore);
        setPage(1);
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
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  return (
    <section className="py-12 bg-slate-50/50 flex-1 border-t border-slate-100">
      <div className="container-scale grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
            <h3 className="font-display font-medium text-lg text-slate-900 flex items-center gap-2 select-none">
              <TrendingUp className="w-5 h-5 text-[#007D9C]" />
              Popular Packages
            </h3>

            <button
              type="button"
              onClick={() => router.push("/popular")}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#007D9C] hover:text-[#005F77] transition-colors cursor-pointer font-sans"
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
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#007D9C] font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer font-sans disabled:opacity-60 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
            <h3 className="font-display font-semibold text-slate-900 text-sm tracking-tight border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Your Favorite Packages ({favorites.length})
              </span>
            </h3>

            {favorites.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400">No saved packages.</p>
                <p className="text-[10px] text-slate-400/85 mt-1">
                  Click the heart on package cards to save them here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {favorites.map((pkg) => (
                  <div
                    key={pkg.importPath}
                    onClick={() => {
                      const encoded = pkg.importPath
                        .split("/")
                        .map(encodeURIComponent)
                        .join("/");
                      router.push(
                        `/package/${encoded}` as Route<`/package/${string}`>,
                      );
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-[#00ADD8] transition-colors truncate">
                        {pkg.importPath.split("/").pop()}
                      </p>

                      <p className="text-[10px] font-mono text-slate-400 truncate">
                        {pkg.importPath}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(pkg.importPath);
                      }}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-colors shrink-0"
                      title="Remove from favorites"
                    >
                      <HeartOff className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
            <h3 className="font-display font-semibold text-slate-900 text-sm tracking-tight border-b border-slate-100 pb-3 mb-4">
              Featured Tags
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="bg-slate-100/80 text-transparent h-6 w-14 rounded-md animate-shimmer relative overflow-hidden inline-block"
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
                    className="bg-slate-50 hover:bg-[#E0F2FE] hover:text-[#007D9C] text-slate-600 text-xs px-2.5 py-1 rounded transition-colors border border-slate-100 cursor-pointer"
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
