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
  const [currentPage, setCurrentPage] = useState(() =>
    typeof window !== "undefined"
      ? Math.max(1, Number(new URLSearchParams(window.location.search).get("page") || 1))
      : 1,
  );
  const [fetchedPage, setFetchedPage] = useState(0);

  const loading = fetchedPage !== currentPage;

  useEffect(() => {
    let active = true;

    fetch(`/api/popular-package?page=${currentPage}&perPage=${PER_PAGE}`)
      .then((r) => r.json())
      .then((data: PopularPackageResponse) => {
        if (!active) return;

        setPackages(data.packages ?? []);
        setTotal(data.total ?? 0);
        setFetchedPage(currentPage);
      })
      .catch(() => {
        if (active) setFetchedPage(currentPage);
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
    <div className="bg-slate-50/40 dark:bg-[#0d1117] py-12 flex-1 transition-colors duration-300">
      <div className="container-scale max-w-4xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-display font-medium text-3xl text-slate-900 dark:text-[#f0f6fc] tracking-tight">
            Featured Popular Packages
          </h2>

          <p className="text-sm text-slate-500 dark:text-[#8b949e] font-light leading-relaxed">
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
