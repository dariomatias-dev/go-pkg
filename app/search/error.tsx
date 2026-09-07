"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function SearchRouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Search route error boundary:", error);
  }, [error]);

  return (
    <div className="container-scale flex min-h-[50vh] flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/30 dark:bg-rose-950/10">
        <SearchX className="h-7 w-7 text-rose-500" />
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-[#f0f6fc]">
          Search failed
        </h2>

        <p className="max-w-sm text-sm text-slate-500 dark:text-[#8b949e]">
          {error.message || "Something went wrong while searching."}
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#c9d1d9]"
        >
          Back to Home
        </Link>

        <button
          type="button"
          onClick={() => unstable_retry()}
          className="cursor-pointer rounded-lg bg-[#006680] px-4 py-2 text-xs font-semibold text-white hover:bg-[#005a71]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
