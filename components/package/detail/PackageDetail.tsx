"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { GoReportCard } from "@/components/package/detail/GoReportCard";
import { PackageBreadcrumb } from "@/components/package/detail/PackageBreadcrumb";
import { PackageDetailError } from "@/components/package/detail/PackageDetailError";
import { PackageDetailSkeleton } from "@/components/package/detail/PackageDetailSkeleton";
import { PackageHeader } from "@/components/package/detail/PackageHeader";
import type { Tab } from "@/components/package/detail/tabs/PackageTabs";
import { PackageTabs } from "@/components/package/detail/tabs/PackageTabs";
import { GopherChat } from "@/components/package/shared/GopherChat";
import { useCompare } from "@/hooks/useCompare";
import { useFavorites } from "@/hooks/useFavorites";
import { saveToPackageHistory } from "@/lib/package-history";
import type { PackageDetailResponse } from "@/types";

interface PackageDetailProps {
  importPath: string;
}

export function PackageDetail({ importPath }: PackageDetailProps) {
  const router = useRouter();

  const [prevImportPath, setPrevImportPath] = useState(importPath);
  const [data, setData] = useState<PackageDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("readme");
  const scrollBarRef = useRef<HTMLDivElement>(null);

  const [aiSummary, setAiSummary] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);

  if (prevImportPath !== importPath) {
    setPrevImportPath(importPath);
    setLoading(true);
    setError(null);
    setData(null);
    setAiSummary("");
    setAiSummaryError(null);
    setActiveTab("readme");
  }

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isCompared, addToCompare, removeFromCompare, isFull } = useCompare();

  const fetchAiSummary = async (path: string) => {
    setAiSummaryLoading(true);
    setAiSummaryError(null);

    try {
      const res = await fetch(
        `/api/package-summary?importPath=${encodeURIComponent(path)}`,
      );

      if (res.ok) {
        const d = await res.json();

        setAiSummary(d.summary);
      } else {
        const d = await res.json().catch(() => ({}));

        setAiSummaryError(
          d.error || "Failed to generate the AI summary. Check the server.",
        );
      }
    } catch {
      setAiSummaryError("Connection error while requesting AI analysis.");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch(`/api/package-info?importPath=${encodeURIComponent(importPath)}`)
      .then((r) => {
        if (!r.ok)
          throw new Error(
            "We couldn't load this package. Verify the Go module exists in proxy.golang.org.",
          );

        return r.json();
      })
      .then((d: PackageDetailResponse) => {
        setData(d);
        saveToPackageHistory(importPath);

        if (!d.pkg.readme) {
          setActiveTab("summary");
          fetchAiSummary(importPath);
        } else {
          setActiveTab("readme");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [importPath]);

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

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);

    if (tab === "summary" && !aiSummary && importPath) {
      fetchAiSummary(importPath);
    }
  };

  if (loading) return <PackageDetailSkeleton />;

  if (error || !data) return <PackageDetailError error={error} />;

  const { pkg, goMod } = data;

  const favorite = isFavorite(importPath);
  const compared = isCompared(importPath);

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

        <PackageHeader
          pkg={pkg}
          isFavorite={favorite}
          isCompared={compared}
          isFull={isFull}
          onToggleFavorite={() => toggleFavorite(pkg)}
          onToggleCompare={() => {
            if (compared) removeFromCompare(importPath);
            else {
              addToCompare(pkg);

              router.push("/compare");
            }
          }}
        />

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
                onRetryAiSummary={() => fetchAiSummary(importPath)}
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
