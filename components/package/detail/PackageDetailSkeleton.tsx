export function PackageDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative h-1 w-full overflow-hidden bg-cyan-100/50 dark:bg-sky-900/20">
        <div className="animate-progress-slide absolute top-0 left-0 h-full w-2/5 rounded-full bg-[#00ADD8] dark:bg-sky-500" />
      </div>

      <div className="border-b border-slate-200 bg-slate-50 py-3 dark:border-[#30363d] dark:bg-[#0d1117]">
        <div className="container-scale flex items-center gap-2">
          <div className="h-3 w-10 rounded-sm bg-slate-200 dark:bg-[#30363d]" />
          <div className="h-3 w-3 rounded-sm bg-slate-200 dark:bg-[#30363d]" />
          <div className="h-3 w-16 rounded-sm bg-slate-200 dark:bg-[#30363d]" />
          <div className="h-3 w-3 rounded-sm bg-slate-200 dark:bg-[#30363d]" />
          <div className="h-5 w-48 rounded-md bg-slate-200 dark:bg-[#30363d]" />
        </div>
      </div>

      <div className="border-b border-slate-200/80 bg-white dark:border-[#30363d] dark:bg-[#0d1117]">
        <div className="container-scale space-y-8 py-10 sm:py-14">
          <div className="flex items-center gap-3">
            <div className="h-5 w-20 rounded bg-slate-200 dark:bg-[#30363d]" />
            <div className="h-4 w-32 rounded bg-slate-100 dark:bg-[#21262d]" />
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-12 w-56 rounded-lg bg-slate-200 dark:bg-[#30363d]" />
                <div className="h-6 w-16 rounded-md bg-slate-100 dark:bg-[#21262d]" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="h-8 w-72 rounded border border-slate-200 bg-slate-100 dark:border-[#30363d] dark:bg-[#21262d]" />
                <div className="h-4 w-40 rounded bg-slate-100 dark:bg-[#21262d]" />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="h-10 w-20 rounded-lg border border-slate-200 bg-slate-100 dark:border-[#30363d] dark:bg-[#21262d]" />
              <div className="h-10 w-24 rounded-lg border border-slate-200 bg-slate-100 dark:border-[#30363d] dark:bg-[#21262d]" />
              <div className="h-10 w-20 rounded-lg border border-slate-200 bg-slate-100 dark:border-[#30363d] dark:bg-[#21262d]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3 w-28 rounded-sm bg-slate-200 dark:bg-[#30363d]" />
            <div className="h-12 w-full max-w-xl rounded-lg border border-slate-200 bg-slate-100 dark:border-[#30363d] dark:bg-[#161b22]" />
          </div>

          <div className="max-w-4xl space-y-2">
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-[#21262d]" />
            <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-[#21262d]" />
            <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-[#21262d]" />
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 rounded-lg border border-slate-200 bg-slate-100 dark:border-[#30363d] dark:bg-[#21262d]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F8FAFC] dark:bg-[#0b0e14]">
        <div className="container-scale grid grid-cols-1 items-start gap-8 py-8 lg:grid-cols-4">
          <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white lg:col-span-3 dark:border-[#30363d] dark:bg-[#161b22]">
            <div className="flex gap-1 border-b border-slate-100 p-2 dark:border-[#30363d]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 w-24 rounded-lg ${i === 0 ? "bg-slate-200 dark:bg-[#30363d]" : "bg-slate-100 dark:bg-[#21262d]"}`}
                />
              ))}
            </div>

            <div className="space-y-4 p-8">
              <div className="h-5 w-1/3 rounded-md bg-slate-200 dark:bg-[#30363d]" />
              <div className="h-3.5 w-full rounded bg-slate-100 dark:bg-[#21262d]" />
              <div className="h-3.5 w-11/12 rounded bg-slate-100 dark:bg-[#21262d]" />
              <div className="h-3.5 w-4/5 rounded bg-slate-100 dark:bg-[#21262d]" />
              <div className="mt-6 h-3.5 w-full rounded bg-slate-100 dark:bg-[#21262d]" />
              <div className="h-3.5 w-3/4 rounded bg-slate-100 dark:bg-[#21262d]" />
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-1">
            <div className="space-y-3 rounded-xl border border-slate-200/60 bg-white p-5 dark:border-[#30363d] dark:bg-[#161b22]">
              <div className="h-4 w-28 rounded bg-slate-200 dark:bg-[#30363d]" />
              <div className="h-3 w-full rounded bg-slate-100 dark:bg-[#21262d]" />
              <div className="h-3 w-4/5 rounded bg-slate-100 dark:bg-[#21262d]" />
              <div className="mt-2 h-8 w-full rounded-lg bg-slate-100 dark:bg-[#21262d]" />
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200/60 bg-white p-5 dark:border-[#30363d] dark:bg-[#161b22]">
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-[#30363d]" />
              <div className="h-20 w-full rounded-lg bg-slate-100 dark:bg-[#21262d]" />
              <div className="h-8 w-full rounded-lg bg-slate-100 dark:bg-[#21262d]" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
