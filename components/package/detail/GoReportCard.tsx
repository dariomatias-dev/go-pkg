"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import type { GoReportCardResult } from "@/app/api/package-report/route";

const GRADE_STYLES: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  "A+": {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  A: {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  B: {
    color: "text-[#007D9C] dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-200 dark:border-sky-500/20",
  },
  C: {
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
  },
  D: {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-500/20",
  },
  F: {
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/20",
  },
};

export function GoReportCard({ importPath }: { importPath: string }) {
  const [state, setState] = useState<{
    result: GoReportCardResult | null;
    loading: boolean;
  }>({
    result: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/package-report?importPath=${encodeURIComponent(importPath)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (isMounted) setState({ result: d, loading: false });
      })
      .catch(() => {
        if (isMounted) setState({ result: null, loading: false });
      });

    return () => {
      isMounted = false;
    };
  }, [importPath]);

  if (state.loading) {
    return (
      <div className="bg-white dark:bg-[#161b22] rounded-xl p-4 border border-slate-200/70 dark:border-[#30363d] animate-pulse">
        <div className="h-10 bg-slate-100 dark:bg-[#0d1117] rounded-lg" />
      </div>
    );
  }

  if (!state.result) return null;

  const style = GRADE_STYLES[state.result.grade] ?? GRADE_STYLES.F;

  return (
    <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200/70 dark:border-[#30363d] shadow-sm overflow-hidden group">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00ADD8] dark:text-sky-400" />
            <h3 className="font-display font-bold text-xs text-slate-900 dark:text-[#f0f6fc] uppercase tracking-wide">
              Report Card
            </h3>
          </div>

          <div className={`font-mono font-black text-xl ${style.color}`}>
            {state.result.grade}
          </div>
        </div>

        <a
          href={state.result.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-slate-50 dark:bg-[#0d1117] hover:bg-slate-100 dark:hover:bg-[#1d222b] border border-slate-200 dark:border-[#30363d] rounded-lg text-[11px] font-bold text-[#007D9C] dark:text-sky-400 transition-all group/link"
        >
          <span>VIEW FULL REPORT</span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 ease-out" />
        </a>
      </div>
    </div>
  );
}
