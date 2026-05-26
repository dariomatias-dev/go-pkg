import { cn } from "@/lib/utils";

export function PackageDetailSkeleton() {
  return (
    <div className="animate-fade-in bg-white dark:bg-[#0d1117]">
      <div className="w-full h-1 bg-cyan-100/50 dark:bg-sky-900/20 relative overflow-hidden">
        <div className="h-full bg-[#00ADD8] dark:bg-sky-500 w-2/5 rounded-full animate-progress-slide absolute top-0 left-0" />
      </div>

      <div className="container-scale py-10">
        <div className="bg-slate-50 dark:bg-[#161b22] border border-slate-100 dark:border-[#30363d] rounded-2xl p-8 mb-8 animate-shimmer relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-slate-200/80 dark:bg-[#30363d] rounded-2xl shrink-0" />
            <div className="space-y-2.5">
              <div className="h-4 w-20 bg-slate-200/80 dark:bg-[#30363d] rounded-full" />
              <div className="h-6 w-56 bg-slate-200/80 dark:bg-[#30363d] rounded-lg" />
              <div className="h-3.5 w-72 bg-slate-100/60 dark:bg-[#30363d]/50 rounded-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-slate-200/80 dark:bg-[#30363d] rounded-lg" />
            <div className="h-10 w-12 bg-slate-200/80 dark:bg-[#30363d] rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-white dark:bg-[#161b22] border border-slate-200/60 dark:border-[#30363d] rounded-xl p-8 space-y-5 animate-shimmer overflow-hidden">
            <div className="flex gap-2 border-b border-slate-100 dark:border-[#30363d] pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-8 w-24 rounded-lg",
                    i === 1
                      ? "bg-slate-200/85 dark:bg-[#30363d]"
                      : "bg-slate-100/70 dark:bg-[#21262d]",
                  )}
                />
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-5 w-1/3 bg-slate-200/80 dark:bg-[#30363d] rounded-md" />
              <div className="h-3.5 w-full bg-slate-100/80 dark:bg-[#21262d] rounded-md" />
              <div className="h-3.5 w-11/12 bg-slate-100/80 dark:bg-[#21262d] rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
