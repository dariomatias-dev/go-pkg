export function PackageCardSkeleton() {
  return (
    <div className="animate-shimmer relative flex flex-col gap-4 overflow-hidden rounded-xl border border-slate-200/60 bg-white p-6 pt-8 shadow-sm transition-colors duration-300 sm:pt-6 dark:border-[#30363d] dark:bg-[#0d1117]">
      <div className="flex flex-wrap gap-2">
        <div className="h-4 w-16 rounded-full bg-slate-200/50 dark:bg-[#30363d]" />
        <div className="h-4 w-10 rounded-full bg-slate-100/60 dark:bg-[#21262d]" />
      </div>

      <div className="space-y-1.5">
        <div className="h-5 w-48 rounded-md bg-slate-200/60 dark:bg-[#30363d]" />
        <div className="h-3 w-64 rounded-sm bg-slate-100/50 dark:bg-[#21262d]" />
      </div>

      <div className="space-y-1.5">
        <div className="h-3 w-full rounded bg-slate-100/50 dark:bg-[#21262d]/80" />
        <div className="h-3 w-4/5 rounded bg-slate-100/40 dark:bg-[#21262d]/60" />
      </div>

      <div className="flex gap-4 pt-1">
        <div className="h-4 w-20 rounded-full bg-slate-100/60 dark:bg-[#21262d]" />
        <div className="h-4 w-16 rounded-full bg-slate-100/50 dark:bg-[#21262d]" />
        <div className="h-4 w-24 rounded-full bg-slate-100/40 dark:bg-[#21262d]" />
      </div>
    </div>
  );
}
