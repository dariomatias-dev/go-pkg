export default function Loading() {
  return (
    <div className="min-h-screen py-8">
      <div className="container-scale">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="space-y-5 lg:col-span-1">
            <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
              <div className="border-b border-slate-100 pb-3 dark:border-[#30363d]">
                <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-[#30363d]" />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-[#30363d] dark:bg-[#0d1117]">
                <div className="mb-2 h-4 w-40 rounded-md bg-slate-200 dark:bg-[#30363d]" />
                <div className="h-3 w-full rounded-sm bg-slate-100 dark:bg-[#21262d]" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 rounded-sm bg-slate-200 dark:bg-[#30363d]" />

                <div className="space-y-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-full rounded-lg bg-slate-100 dark:bg-[#21262d]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6 lg:col-span-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white px-6 py-4 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]">
              <div className="h-4 w-40 rounded-md bg-slate-200 dark:bg-[#30363d]" />

              <div className="flex gap-4">
                <div className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-[#21262d]" />
                <div className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-[#21262d]" />
              </div>
            </div>

            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-[#30363d] dark:bg-[#161b22]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-48 rounded-md bg-slate-200 dark:bg-[#30363d]" />
                      <div className="h-3.5 w-full rounded-sm bg-slate-100 dark:bg-[#21262d]" />
                      <div className="h-3.5 w-4/5 rounded-sm bg-slate-100 dark:bg-[#21262d]" />
                    </div>

                    <div className="h-9 w-20 shrink-0 rounded-lg bg-slate-100 dark:bg-[#21262d]" />
                  </div>

                  <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-[#21262d]" />
                    <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-[#21262d]" />
                    <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-[#21262d]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
