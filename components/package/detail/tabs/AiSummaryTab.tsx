"use client";

import { HelpCircle, Sparkles } from "lucide-react";

import { MarkdownRenderer } from "@/components/package/shared/MarkdownRenderer";

interface AiSummaryTabProps {
  loading: boolean;
  error: string | null;
  summary: string;
  onRetry: () => void;
}

export function AiSummaryTab({
  loading,
  error,
  summary,
  onRetry,
}: AiSummaryTabProps) {
  return (
    <div className="space-y-6 animate-fade-in transition-colors duration-300">
      <div className="border-b border-slate-100 dark:border-[#30363d] pb-3 flex items-center justify-between">
        <h4 className="font-display font-semibold text-lg text-slate-900 dark:text-[#f0f6fc] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#00ADD8] dark:text-sky-400" />
          AI Technical Summary
        </h4>

        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          Generative Model Processing
        </span>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-slate-100 dark:border-[#30363d] border-t-[#00ADD8] dark:border-t-sky-500 animate-spin" />

          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono animate-pulse">
            Requesting analysis from Gopher AI...
          </p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-sm flex items-center gap-3">
          <HelpCircle className="w-5 h-5 shrink-0" />

          <span className="flex-1">{error}</span>

          <button
            onClick={onRetry}
            className="text-xs font-bold border border-rose-300 dark:border-rose-800 px-2.5 py-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      ) : summary ? (
        <div className="bg-sky-50/10 dark:bg-[#161b22] border border-sky-100/30 dark:border-[#30363d] rounded-xl p-6 leading-relaxed text-sm text-slate-700 dark:text-[#c9d1d9] space-y-4 shadow-sm">
          <MarkdownRenderer content={summary} />
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500">
          No summary available. Reload or select this tab again to retry.
        </div>
      )}
    </div>
  );
}
