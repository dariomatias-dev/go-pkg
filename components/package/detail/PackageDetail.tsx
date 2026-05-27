"use client";

import { useEffect, useRef } from "react";

import { GoReportCard } from "@/components/package/detail/GoReportCard";
import { PackageBreadcrumb } from "@/components/package/detail/PackageBreadcrumb";
import { PackageDetailError } from "@/components/package/detail/PackageDetailError";
import { PackageDetailSkeleton } from "@/components/package/detail/PackageDetailSkeleton";
import { PackageHeader } from "@/components/package/detail/PackageHeader";
import { PackageTabs } from "@/components/package/detail/tabs/PackageTabs";
import { GopherChat } from "@/components/package/shared/GopherChat";
import { usePackageDetail } from "@/hooks/usePackageDetail";

interface PackageDetailProps {
  importPath: string;
  initialTab?: import("@/components/package/detail/tabs/PackageTabs").Tab;
}

export function PackageDetail({ importPath, initialTab }: PackageDetailProps) {
  const {
    data,
    loading,
    error,
    activeTab,
    aiSummary,
    aiSummaryLoading,
    aiSummaryError,
    handleTabChange,
    retryAiSummary,
  } = usePackageDetail(importPath, initialTab);

  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollBarRef.current) {
        scrollBarRef.current.style.width = `${h > 0 ? (window.scrollY / h) * 100 : 0}%`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return <PackageDetailSkeleton />;

  if (error || !data) return <PackageDetailError error={error} />;

  const { pkg, goMod } = data;

  return (
    <>
      <div className="fixed top-16 left-0 right-0 h-1.5 bg-slate-200/50 dark:bg-[#30363d]/50 z-30 shadow-sm pointer-events-none select-none">
        <div
          ref={scrollBarRef}
          className="h-full bg-linear-to-r from-cyan-400 via-[#00ADD8] to-[#007D9C] transition-all duration-75 ease-out"
          style={{ width: "0%" }}
        />
      </div>

      <div className="flex-1 flex flex-col animate-fade-in relative transition-colors duration-300">
        <PackageBreadcrumb importPath={pkg.importPath} />

        <PackageHeader pkg={pkg} />

        <div className="bg-[#F8FAFC] dark:bg-[#0b0e14]">
          <div className="container-scale grid grid-cols-1 lg:grid-cols-4 gap-8 py-8 items-start">
            <div className="lg:col-span-3">
              <PackageTabs
                pkg={pkg}
                goMod={goMod}
                activeTab={activeTab}
                aiSummary={aiSummary}
                aiSummaryLoading={aiSummaryLoading}
                aiSummaryError={aiSummaryError}
                onTabChange={handleTabChange}
                onRetryAiSummary={retryAiSummary}
              />
            </div>

            <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 lg:self-start">
              {pkg.githubUrl && <GoReportCard importPath={importPath} />}

              <GopherChat
                importPath={importPath}
                description={pkg.description}
              />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
