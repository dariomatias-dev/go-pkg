interface PackageVersionsTabProps {
  versions: string[] | undefined;
  latestVersion: string | undefined;
}

export function PackageVersionsTab({ versions, latestVersion }: PackageVersionsTabProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="font-display font-semibold text-slate-800 dark:text-[#f0f6fc] text-base border-b border-slate-100 dark:border-[#30363d] pb-2">
        Version History
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
        {versions && versions.length > 0 ? (
          versions.map((ver) => (
            <div
              key={ver}
              className={`p-3.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                ver === latestVersion
                  ? "border-[#00ADD8] dark:border-sky-500 bg-sky-50 dark:bg-sky-950/20 font-bold text-[#007D9C] dark:text-sky-400"
                  : "border-slate-200 dark:border-[#30363d] text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-50 dark:hover:bg-[#161b22]"
              }`}
            >
              <span className="font-mono">{ver}</span>

              {ver === latestVersion && (
                <span className="text-[9px] bg-[#00ADD8] text-white py-0.5 px-1.5 rounded uppercase font-bold tracking-tight">
                  latest
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-400">
            Only version &apos;{latestVersion}&apos; was mapped.
          </div>
        )}
      </div>
    </div>
  );
}
