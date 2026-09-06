"use client";

import { Boxes, Home, Search, Terminal } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="animate-fade-in relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-white p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px] opacity-40" />
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-linear-to-r from-transparent via-[#00ADD8]/20 to-transparent" />

      <div className="relative z-10 w-full max-w-2xl space-y-12 text-center">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="group relative">
              <div className="absolute -inset-4 rounded-full bg-slate-100/50 blur-2xl transition-colors duration-500 group-hover:bg-[#00ADD8]/10" />

              <div className="relative flex h-24 w-24 transform items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-300 group-hover:rotate-2">
                <Boxes className="h-12 w-12 text-[#007D9C]" />
              </div>

              <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white bg-[#00ADD8] shadow-lg">
                <Terminal className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-9xl leading-none font-black tracking-tighter text-slate-950 select-none">
              404
            </h1>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                Package Resolution Error
              </h2>

              <p className="mx-auto max-w-sm text-base leading-relaxed font-medium text-slate-500">
                The requested package path does not exist or has been removed
                from the registry index. Please verify the import path.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
          <Link
            href="/search"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#007D9C] px-10 py-4 text-sm font-bold text-white shadow-xl shadow-[#007D9C]/20 transition-all hover:bg-[#005F77] active:scale-95 sm:w-auto"
          >
            <Search className="h-4.5 w-4.5" />
            Search Packages
          </Link>

          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-10 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 sm:w-auto"
          >
            <Home className="h-4.5 w-4.5" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
