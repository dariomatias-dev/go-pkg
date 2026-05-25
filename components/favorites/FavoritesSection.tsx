"use client";

import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

import { PackageCard } from "@/components/package/PackageCard";
import { useFavorites } from "@/hooks/useFavorites";

export function FavoritesSection() {
  const router = useRouter();
  const { favorites } = useFavorites();

  return (
    <div className="container-scale py-12 flex-1 animate-fade-in font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-b border-slate-200/65 pb-4">
          <div className="space-y-1">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Your Favorite Packages
            </h2>

            <p className="text-xs sm:text-sm text-slate-500">
              Track and quickly access your saved packages stored in the
              browser.
            </p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white border border-slate-200 py-16 px-6 rounded-2xl text-center shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <BookOpen className="w-7 h-7 text-slate-400" />
            </div>

            <h3 className="font-bold text-slate-800 text-base">
              No favorites yet
            </h3>

            <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t added any packages yet. Browse featured packages
              or search and add them to your favorites!
            </p>

            <button
              onClick={() => router.push("/search")}
              className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-[#007D9C] hover:bg-[#005F77] text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              Browse Go Modules
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((pkg, idx) => (
              <PackageCard key={pkg.importPath} pkg={pkg} index={idx + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
