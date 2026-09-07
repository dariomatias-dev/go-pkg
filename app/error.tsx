"use client";

import { AlertTriangle, Home, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/30 dark:bg-rose-950/10">
        <AlertTriangle className="h-8 w-8 text-rose-500" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-xl font-bold text-slate-900 dark:text-[#f0f6fc]">
          Something went wrong
        </h1>

        <p className="max-w-sm text-sm text-slate-500 dark:text-[#8b949e]">
          An unexpected error interrupted this page. Trying again usually fixes
          a transient failure.
        </p>

        {error.digest && (
          <p className="font-mono text-xs text-slate-400 dark:text-slate-600">
            Reference: {error.digest}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#c9d1d9]"
        >
          <Home className="h-3.5 w-3.5" />
          Back to Home
        </Link>

        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#006680] px-4 py-2 text-xs font-semibold text-white hover:bg-[#005a71]"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    </div>
  );
}
