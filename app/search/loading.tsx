export default function Loading() {
  return (
    <div className="min-h-screen py-8">
      <div className="container-scale">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-5">
            <div className="bg-white dark:bg-[#161b22] rounded-xl p-5 border border-slate-200 dark:border-[#30363d] shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100 dark:border-[#30363d]">
                <div className="h-4 w-28 bg-slate-200 dark:bg-[#30363d] rounded-md" />
              </div>

              <div className="bg-slate-50/50 dark:bg-[#0d1117] rounded-xl p-3.5 border border-slate-200 dark:border-[#30363d]">
                <div className="h-4 w-40 bg-slate-200 dark:bg-[#30363d] rounded-md mb-2" />
                <div className="h-3 w-full bg-slate-100 dark:bg-[#21262d] rounded-sm" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-200 dark:bg-[#30363d] rounded-sm" />

                <div className="space-y-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-full bg-slate-100 dark:bg-[#21262d] rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#161b22] rounded-xl py-4 px-6 border border-slate-200/70 dark:border-[#30363d] shadow-sm flex items-center justify-between">
              <div className="h-4 w-40 bg-slate-200 dark:bg-[#30363d] rounded-md" />

              <div className="flex gap-4">
                <div className="h-8 w-24 bg-slate-100 dark:bg-[#21262d] rounded-lg" />
                <div className="h-8 w-24 bg-slate-100 dark:bg-[#21262d] rounded-lg" />
              </div>
            </div>

            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#161b22] rounded-xl p-5 border border-slate-200/70 dark:border-[#30363d] shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-48 bg-slate-200 dark:bg-[#30363d] rounded-md" />
                      <div className="h-3.5 w-full bg-slate-100 dark:bg-[#21262d] rounded-sm" />
                      <div className="h-3.5 w-4/5 bg-slate-100 dark:bg-[#21262d] rounded-sm" />
                    </div>

                    <div className="h-9 w-20 bg-slate-100 dark:bg-[#21262d] rounded-lg shrink-0" />
                  </div>

                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-slate-100 dark:bg-[#21262d] rounded-full" />
                    <div className="h-5 w-16 bg-slate-100 dark:bg-[#21262d] rounded-full" />
                    <div className="h-5 w-16 bg-slate-100 dark:bg-[#21262d] rounded-full" />
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
