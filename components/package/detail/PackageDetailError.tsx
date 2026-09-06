"use client";

import { HeartOff } from "lucide-react";
import Link from "next/link";

interface PackageDetailErrorProps {
  error: string | null;
}

export function PackageDetailError({ error }: PackageDetailErrorProps) {
  return (
    <div className="container-scale py-12">
      <div className="mx-auto max-w-md rounded-xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/30 dark:bg-rose-950/10">
        <HeartOff className="mx-auto mb-4 h-12 w-12 text-rose-500" />

        <h3 className="text-lg font-semibold text-slate-900 dark:text-[#f0f6fc]">
          Package Resolution Error
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-[#8b949e]">
          {error ?? "Failed to load this package."}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#c9d1d9]"
          >
            Back to Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
