"use client";

import { ArrowRight, Heart, HeartOff, Loader2, TrendingUp } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
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
    <section className="flex-1 border-t border-slate-100 bg-slate-50/50 py-12 transition-colors duration-300 dark:border-[#30363d] dark:bg-black">
      <div className="container-scale grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-[#30363d]">
            <h3 className="font-display flex items-center gap-2 text-lg font-medium text-slate-900 select-none dark:text-[#f0f6fc]">
              <TrendingUp className="h-5 w-5 text-[#006680] dark:text-sky-400" />
              Popular Packages
            </h3>

            <button
              type="button"
              onClick={() => router.push("/popular")}
              className="inline-flex cursor-pointer items-center gap-1 font-sans text-xs font-bold text-[#006680] transition-colors hover:text-[#005F77] dark:text-sky-400 dark:hover:text-sky-300"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
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
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-sans text-xs font-bold text-[#006680] shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-60 dark:border-[#30363d] dark:bg-[#21262d] dark:text-sky-400 dark:hover:bg-[#30363d]"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
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

          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
            <h3 className="font-display mb-4 flex items-center justify-between border-b border-slate-100 pb-3 text-sm font-semibold tracking-tight text-slate-900 dark:border-[#30363d] dark:text-[#f0f6fc]">
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                Your Favorites ({favorites.length})
              </span>
            </h3>

            {favorites.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-slate-500 dark:text-[#8b949e]">
                  No saved packages.
                </p>

                <p className="mt-1 text-[10px] text-slate-500 dark:text-[#8b949e]/60">
                  Click the heart on package cards to save them.
                </p>
              </div>
            ) : (
              <div className="custom-scrollbar max-h-60 space-y-2.5 overflow-y-auto pr-1">
                {favorites.map((pkg) => (
                  <div
                    key={pkg.importPath}
                    className="group relative flex items-center justify-between rounded-lg border border-slate-100 p-2 transition-all hover:border-slate-200 hover:bg-slate-50 dark:border-[#30363d] dark:hover:border-slate-700 dark:hover:bg-[#21262d]"
                  >
                    <Link
                      href={
                        `/package/${encodeImportPath(pkg.importPath)}` as Route<`/package/${string}`>
                      }
                      className="min-w-0 flex-1 pr-2 after:absolute after:inset-0 after:content-['']"
                    >
                      <p className="truncate text-xs font-semibold text-slate-800 transition-colors group-hover:text-[#00ADD8] dark:text-[#c9d1d9] dark:group-hover:text-sky-400">
                        {pkg.importPath.split("/").pop()}
                      </p>

                      <p className="truncate font-mono text-[10px] text-slate-500 dark:text-[#8b949e]">
                        {pkg.importPath}
                      </p>
                    </Link>

                    <button
                      type="button"
                      aria-label={`Remove ${pkg.importPath.split("/").pop()} from favorites`}
                      onClick={() => removeFavorite(pkg.importPath)}
                      className="relative z-10 shrink-0 cursor-pointer rounded p-1 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:text-[#484f58] dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    >
                      <HeartOff className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
            <h3 className="font-display mb-4 border-b border-slate-100 pb-3 text-sm font-semibold tracking-tight text-slate-900 dark:border-[#30363d] dark:text-[#f0f6fc]">
              Featured Tags
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className="animate-shimmer relative inline-block h-6 w-14 overflow-hidden rounded-md bg-slate-100/80 text-transparent dark:bg-[#21262d]"
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
                    className="cursor-pointer rounded border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 transition-colors hover:bg-[#E0F2FE] hover:text-[#006680] dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#c9d1d9] dark:hover:bg-[#30363d] dark:hover:text-white"
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
