"use client";

import { useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
      <div className="pointer-events-none fixed top-16 right-0 left-0 z-30 h-1.5 bg-slate-200/50 shadow-sm select-none dark:bg-[#30363d]/50">
        <div
          ref={scrollBarRef}
          className="h-full bg-linear-to-r from-cyan-400 via-[#00ADD8] to-[#007D9C] transition-all duration-75 ease-out"
          style={{ width: "0%" }}
        />
      </div>

      <div className="animate-fade-in relative flex flex-1 flex-col transition-colors duration-300">
        <PackageBreadcrumb importPath={pkg.importPath} />

        <PackageHeader pkg={pkg} />

        <div className="bg-[#F8FAFC] dark:bg-[#0b0e14]">
          <div className="container-scale grid grid-cols-1 items-start gap-8 py-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <ErrorBoundary
                resetKeys={[importPath]}
                fallback={
                  <div className="rounded-xl border border-slate-200/70 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#8b949e]">
                    Failed to render package content.
                  </div>
                }
              >
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
              </ErrorBoundary>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-20 lg:col-span-1 lg:self-start">
              {pkg.githubUrl && <GoReportCard importPath={importPath} />}

              <ErrorBoundary resetKeys={[importPath]} fallback={null}>
                <GopherChat
                  importPath={importPath}
                  description={pkg.description}
                />
              </ErrorBoundary>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
