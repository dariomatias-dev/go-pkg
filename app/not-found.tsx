"use client";

import { Boxes, Home, Search, Terminal } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 animate-fade-in relative bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-transparent via-[#00ADD8]/20 to-transparent" />

      <div className="max-w-2xl w-full text-center space-y-12 relative z-10">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-slate-100/50 rounded-full blur-2xl group-hover:bg-[#00ADD8]/10 transition-colors duration-500" />

              <div className="relative w-24 h-24 bg-white border border-slate-200 rounded-3xl shadow-sm flex items-center justify-center transform group-hover:rotate-2 transition-transform duration-300">
                <Boxes className="w-12 h-12 text-[#007D9C]" />
              </div>

              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#00ADD8] rounded-xl shadow-lg border-2 border-white flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-9xl font-black text-slate-950 tracking-tighter leading-none select-none">
              404
            </h1>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">
                Package Resolution Error
              </h2>

              <p className="text-slate-500 text-base max-w-sm mx-auto leading-relaxed font-medium">
                The requested module path does not exist or has been removed
                from the registry index. Please verify the import path.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/search"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#007D9C] hover:bg-[#005F77] text-white px-10 py-4 rounded-xl font-bold text-sm transition-all shadow-xl shadow-[#007D9C]/20 active:scale-95"
          >
            <Search className="w-4.5 h-4.5" />
            Search Modules
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-10 py-4 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
          >
            <Home className="w-4.5 h-4.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
