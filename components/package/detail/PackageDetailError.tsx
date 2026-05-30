"use client";

import { HeartOff } from "lucide-react";
import Link from "next/link";

interface PackageDetailErrorProps {
  error: string | null;
}

export function PackageDetailError({ error }: PackageDetailErrorProps) {
  return (
    <div className="container-scale py-12">
      <div className="max-w-md mx-auto bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 p-8 rounded-xl text-center">
        <HeartOff className="w-12 h-12 text-rose-500 mx-auto mb-4" />

        <h3 className="font-semibold text-slate-900 dark:text-[#f0f6fc] text-lg">
          Package Resolution Error
        </h3>

        <p className="text-slate-500 dark:text-[#8b949e] text-sm mt-2">
          {error ?? "Failed to load this package."}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="bg-white dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#c9d1d9] px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Back to Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
