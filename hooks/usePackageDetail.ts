"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { Tab } from "@/components/package/detail/tabs/PackageTabs";
import { saveToPackageHistory } from "@/lib/package-history";
import type { PackageDetailResponse } from "@/types";

export function usePackageDetail(importPath: string, initialTab?: Tab) {
  const router = useRouter();
  const pathname = usePathname();

  const [prevImportPath, setPrevImportPath] = useState(importPath);
  const [capturedInitialTab, setCapturedInitialTab] = useState(initialTab);
  const [data, setData] = useState<PackageDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(initialTab ?? "readme");

  const [aiSummary, setAiSummary] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);

  if (prevImportPath !== importPath) {
    setPrevImportPath(importPath);
    setCapturedInitialTab(initialTab);
    setLoading(true);
    setError(null);
    setData(null);
    setAiSummary("");
    setAiSummaryError(null);
    setActiveTab(initialTab ?? "readme");
  }

  const pushTab = useCallback(
    (tab: Tab) => {
      const params = new URLSearchParams({ tab });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router],
  );

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

        if (capturedInitialTab) {
          setActiveTab(capturedInitialTab);

          if (capturedInitialTab === "summary") fetchAiSummary(importPath);
        } else if (!d.pkg.readme) {
          setActiveTab("summary");

          pushTab("summary");

          fetchAiSummary(importPath);
        } else {
          setActiveTab("readme");

          pushTab("readme");
        }
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [importPath, capturedInitialTab, pushTab]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    pushTab(tab);

    if (tab === "summary" && !aiSummary) {
      fetchAiSummary(importPath);
    }
  };

  return {
    data,
    loading,
    error,
    activeTab,
    aiSummary,
    aiSummaryLoading,
    aiSummaryError,
    handleTabChange,
    retryAiSummary: () => fetchAiSummary(importPath),
  };
}
