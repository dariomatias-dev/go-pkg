"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PackageCardSkeleton } from "@/components/common/PackageCardSkeleton";
import { Pagination } from "@/components/common/Pagination";
import { PackageCard } from "@/components/package/card/PackageCard";
import type { PopularPackage, PopularPackageResponse } from "@/types";

const PER_PAGE = 10;

export function PopularPageContent() {
  const router = useRouter();
  const [packages, setPackages] = useState<PopularPackage[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(() =>
    typeof window !== "undefined"
      ? Math.max(
          1,
          Number(new URLSearchParams(window.location.search).get("page") || 1),
        )
      : 1,
  );
  const [fetchedPage, setFetchedPage] = useState(0);

  const loading = fetchedPage !== currentPage;

  useEffect(() => {
    let active = true;

    fetch(`/api/popular-package?page=${currentPage}&perPage=${PER_PAGE}`)
      .then(async (r) => {
        const data = await r.json();

        if (!r.ok) {
          throw new Error(
            data?.error?.message || "Failed to load popular packages.",
          );
        }

        return data as PopularPackageResponse;
      })
      .then((data) => {
        if (!active) return;

        setError(null);
        setPackages(data.packages ?? []);
        setTotal(data.total ?? 0);
        setFetchedPage(currentPage);
      })
      .catch((err: Error) => {
        if (!active) return;

        setError(err.message);
        setPackages([]);
        setTotal(0);
        setFetchedPage(currentPage);
      });

    return () => {
      active = false;
    };
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    router.replace(`?page=${page}`, { scroll: false });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1 bg-slate-50/40 py-12 transition-colors duration-300 dark:bg-[#0d1117]">
      <div className="container-scale max-w-4xl space-y-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="font-display text-3xl font-medium tracking-tight text-slate-900 dark:text-[#f0f6fc]">
            Featured Popular Packages
          </h2>

          <p className="text-sm leading-relaxed font-light text-slate-500 dark:text-[#8b949e]">
            Go packages with the highest import count across open GitHub
            repositories and Go Proxy telemetry this quarter.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-900/30 dark:bg-amber-950/10">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {error}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg, idx) => (
              <PackageCard
                key={pkg.importPath}
                pkg={pkg}
                index={(currentPage - 1) * PER_PAGE + idx + 1}
              />
            ))}

            {total > PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalResults={total}
                perPage={PER_PAGE}
                onPageChange={handlePageChange}
                isLoading={loading}
                itemCountInPage={packages.length}
                label="popular packages"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
