export function PackageDetailSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full h-1 bg-cyan-100/50 dark:bg-sky-900/20 relative overflow-hidden">
        <div className="h-full bg-[#00ADD8] dark:bg-sky-500 w-2/5 rounded-full animate-progress-slide absolute top-0 left-0" />
      </div>

      <div className="bg-slate-50 dark:bg-[#0d1117] border-b border-slate-200 dark:border-[#30363d] py-3">
        <div className="container-scale flex items-center gap-2">
          <div className="h-3 w-10 bg-slate-200 dark:bg-[#30363d] rounded-sm" />
          <div className="h-3 w-3 bg-slate-200 dark:bg-[#30363d] rounded-sm" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-[#30363d] rounded-sm" />
          <div className="h-3 w-3 bg-slate-200 dark:bg-[#30363d] rounded-sm" />
          <div className="h-5 w-48 bg-slate-200 dark:bg-[#30363d] rounded-md" />
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white dark:border-[#30363d] dark:bg-[#0d1117]">
        <div className="container-scale py-10 sm:py-14 space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-5 w-20 bg-slate-200 dark:bg-[#30363d] rounded" />
            <div className="h-4 w-32 bg-slate-100 dark:bg-[#21262d] rounded" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-12 w-56 bg-slate-200 dark:bg-[#30363d] rounded-lg" />
                <div className="h-6 w-16 bg-slate-100 dark:bg-[#21262d] rounded-md" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="h-8 w-72 bg-slate-100 dark:bg-[#21262d] rounded border border-slate-200 dark:border-[#30363d]" />
                <div className="h-4 w-40 bg-slate-100 dark:bg-[#21262d] rounded" />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="h-10 w-20 bg-slate-100 dark:bg-[#21262d] rounded-lg border border-slate-200 dark:border-[#30363d]" />
              <div className="h-10 w-24 bg-slate-100 dark:bg-[#21262d] rounded-lg border border-slate-200 dark:border-[#30363d]" />
              <div className="h-10 w-20 bg-slate-100 dark:bg-[#21262d] rounded-lg border border-slate-200 dark:border-[#30363d]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-28 bg-slate-200 dark:bg-[#30363d] rounded-sm" />
            <div className="h-12 w-full max-w-xl bg-slate-100 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-[#30363d]" />
          </div>

          <div className="space-y-2 max-w-4xl">
            <div className="h-4 w-full bg-slate-100 dark:bg-[#21262d] rounded" />
            <div className="h-4 w-5/6 bg-slate-100 dark:bg-[#21262d] rounded" />
            <div className="h-4 w-3/4 bg-slate-100 dark:bg-[#21262d] rounded" />
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-slate-100 dark:bg-[#21262d] rounded-lg border border-slate-200 dark:border-[#30363d]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F8FAFC] dark:bg-[#0b0e14]">
        <div className="container-scale grid grid-cols-1 lg:grid-cols-4 gap-8 py-8 items-start">
          <div className="lg:col-span-3 bg-white dark:bg-[#161b22] border border-slate-200/60 dark:border-[#30363d] rounded-xl overflow-hidden">
            <div className="flex gap-1 border-b border-slate-100 dark:border-[#30363d] p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 w-24 rounded-lg ${i === 0 ? "bg-slate-200 dark:bg-[#30363d]" : "bg-slate-100 dark:bg-[#21262d]"}`}
                />
              ))}
            </div>

            <div className="p-8 space-y-4">
              <div className="h-5 w-1/3 bg-slate-200 dark:bg-[#30363d] rounded-md" />
              <div className="h-3.5 w-full bg-slate-100 dark:bg-[#21262d] rounded" />
              <div className="h-3.5 w-11/12 bg-slate-100 dark:bg-[#21262d] rounded" />
              <div className="h-3.5 w-4/5 bg-slate-100 dark:bg-[#21262d] rounded" />
              <div className="h-3.5 w-full bg-slate-100 dark:bg-[#21262d] rounded mt-6" />
              <div className="h-3.5 w-3/4 bg-slate-100 dark:bg-[#21262d] rounded" />
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#161b22] border border-slate-200/60 dark:border-[#30363d] rounded-xl p-5 space-y-3">
              <div className="h-4 w-28 bg-slate-200 dark:bg-[#30363d] rounded" />
              <div className="h-3 w-full bg-slate-100 dark:bg-[#21262d] rounded" />
              <div className="h-3 w-4/5 bg-slate-100 dark:bg-[#21262d] rounded" />
              <div className="h-8 w-full bg-slate-100 dark:bg-[#21262d] rounded-lg mt-2" />
            </div>

            <div className="bg-white dark:bg-[#161b22] border border-slate-200/60 dark:border-[#30363d] rounded-xl p-5 space-y-3">
              <div className="h-4 w-24 bg-slate-200 dark:bg-[#30363d] rounded" />
              <div className="h-20 w-full bg-slate-100 dark:bg-[#21262d] rounded-lg" />
              <div className="h-8 w-full bg-slate-100 dark:bg-[#21262d] rounded-lg" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
