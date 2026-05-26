export function PackageCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0d1117] rounded-xl p-6 border border-slate-200/60 dark:border-[#30363d] shadow-sm animate-shimmer relative overflow-hidden flex flex-col gap-4 pt-8 sm:pt-6 transition-colors duration-300">
      <div className="flex flex-wrap gap-2">
        <div className="h-4 w-16 bg-slate-200/50 dark:bg-[#30363d] rounded-full" />
        <div className="h-4 w-10 bg-slate-100/60 dark:bg-[#21262d] rounded-full" />
      </div>

      <div className="space-y-1.5">
        <div className="h-5 w-48 bg-slate-200/60 dark:bg-[#30363d] rounded-md" />
        <div className="h-3 w-64 bg-slate-100/50 dark:bg-[#21262d] rounded-sm" />
      </div>

      <div className="space-y-1.5">
        <div className="h-3 w-full bg-slate-100/50 dark:bg-[#21262d]/80 rounded" />
        <div className="h-3 w-4/5 bg-slate-100/40 dark:bg-[#21262d]/60 rounded" />
      </div>

      <div className="flex gap-4 pt-1">
        <div className="h-4 w-20 bg-slate-100/60 dark:bg-[#21262d] rounded-full" />
        <div className="h-4 w-16 bg-slate-100/50 dark:bg-[#21262d] rounded-full" />
        <div className="h-4 w-24 bg-slate-100/40 dark:bg-[#21262d] rounded-full" />
      </div>
    </div>
  );
}
