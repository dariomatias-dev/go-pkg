import { PackageCardSkeleton } from "@/components/common/PackageCardSkeleton";

export default function Loading() {
  return (
    <div className="flex-1 bg-white py-12 transition-colors duration-300 sm:py-20 dark:bg-[#0b0e14]">
      <div className="container-scale max-w-5xl space-y-12">
        <div className="flex flex-col justify-between gap-8 border-b border-slate-100 pb-10 md:flex-row md:items-end dark:border-[#30363d]/50">
          <div className="space-y-4">
            <div className="h-3 w-40 rounded-sm bg-slate-100 dark:bg-[#21262d]" />
            <div className="h-14 w-56 rounded-xl bg-slate-200 dark:bg-[#30363d]" />
            <div className="h-4 w-96 rounded bg-slate-100 dark:bg-[#21262d]" />
            <div className="h-4 w-72 rounded bg-slate-100 dark:bg-[#21262d]" />
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PackageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
