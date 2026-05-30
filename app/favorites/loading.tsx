import { PackageCardSkeleton } from "@/components/common/PackageCardSkeleton";

export default function Loading() {
  return (
    <div className="bg-white dark:bg-[#0b0e14] py-12 sm:py-20 flex-1 transition-colors duration-300">
      <div className="container-scale max-w-5xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-100 dark:border-[#30363d]/50">
          <div className="space-y-4">
            <div className="h-3 w-40 bg-slate-100 dark:bg-[#21262d] rounded-sm" />
            <div className="h-14 w-56 bg-slate-200 dark:bg-[#30363d] rounded-xl" />
            <div className="h-4 w-96 bg-slate-100 dark:bg-[#21262d] rounded" />
            <div className="h-4 w-72 bg-slate-100 dark:bg-[#21262d] rounded" />
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
