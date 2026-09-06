"use client";

import { ChevronDown, Moon, Sun } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Suspense, useEffect, useRef, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/common/Tooltip";
import { HeaderSearch } from "@/components/layout/header/HeaderSearch";
import { ECOSYSTEM_LINKS, NAV_LINKS } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { favorites } = useFavorites();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = NAV_LINKS.map((link) => ({
    ...link,
    badge:
      link.href === "/favorites" ? favorites.length || undefined : undefined,
  }));

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const dropdownItemClass = (route: string) => {
    const active = pathname.startsWith(route);

    return `w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${
      active
        ? "bg-sky-100/60 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400"
        : "text-slate-600 dark:text-[#8b949e] hover:bg-slate-100 dark:hover:bg-[#21262d] hover:text-sky-600 dark:hover:text-[#f0f6fc]"
    }`;
  };

  return (
    <header className="bg-go-blue sticky top-0 z-100 h-16 w-full border-b border-[#005a71]/50 shadow-md transition-colors duration-300 select-none dark:border-[#30363d] dark:bg-[#0d1117]">
      <div className="container-scale flex h-full items-center justify-between gap-6">
        <div className="flex shrink-0 items-center space-x-1">
          <Link
            href="/"
            className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            <Image
              src="/logo.png"
              alt="GoPkg"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>

          <Link
            href="/"
            className="font-display text-2xl font-black tracking-tight text-white transition-opacity hover:opacity-90 dark:text-[#f0f6fc]"
          >
            Pkg
          </Link>
        </div>

        <Suspense fallback={null}>
          <HeaderSearch onSearch={() => setMenuOpen(false)} />
        </Suspense>

        <div className="flex shrink-0 items-center gap-3">
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-9 w-9 cursor-pointer rounded-full border border-sky-400/20 text-white transition-all hover:bg-white focus-visible:ring-0 dark:border-[#30363d] dark:text-[#8b949e] dark:hover:bg-[#30363d]"
                    >
                      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />

                      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>

                <TooltipContent>Change theme</TooltipContent>
              </Tooltip>

              <DropdownMenuContent
                align="end"
                sideOffset={12}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="z-110 w-40 rounded-2xl border-slate-200 bg-white p-1.5 shadow-2xl dark:border-[#30363d] dark:bg-[#161b22]"
              >
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium dark:text-[#c9d1d9] dark:focus:bg-[#21262d] dark:focus:text-[#f0f6fc]"
                >
                  Light
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium dark:text-[#c9d1d9] dark:focus:bg-[#21262d] dark:focus:text-[#f0f6fc]"
                >
                  Dark
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium dark:text-[#c9d1d9] dark:focus:bg-[#21262d] dark:focus:text-[#f0f6fc]"
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-sky-400/30 bg-[#005a71] px-4 py-1.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#004d61] dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#c9d1d9] dark:hover:bg-[#30363d] dark:hover:text-[#f0f6fc]"
            >
              <span>Menu</span>

              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-300",
                  menuOpen && "rotate-180",
                )}
              />
            </button>

            {menuOpen && (
              <div className="animate-in fade-in zoom-in-95 slide-in-from-top-2 absolute top-[calc(100%+12px)] right-0 z-110 max-h-[calc(100vh-80px)] w-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:border-[#30363d] dark:bg-[#161b22] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="md:hidden">
                  <p className="px-3.5 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-[#8b949e]">
                    Search
                  </p>

                  <Suspense fallback={null}>
                    <HeaderSearch mobile onSearch={() => setMenuOpen(false)} />
                  </Suspense>
                </div>

                <div className="mb-4 space-y-1">
                  <p className="px-3.5 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-[#8b949e]">
                    Navigation
                  </p>

                  {navLinks.map(({ href, label, icon: Icon, badge }) => (
                    <Link
                      key={href}
                      href={href as Route}
                      onClick={() => setMenuOpen(false)}
                      className={dropdownItemClass(href)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 opacity-70" />
                        <span>{label}</span>
                      </div>

                      {badge !== undefined && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-100 px-1.5 text-[10px] font-black text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                          {badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="px-3.5 py-2 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-[#8b949e]">
                    Go Ecosystem
                  </p>

                  {ECOSYSTEM_LINKS.map(({ href, label, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:text-[#c9d1d9] dark:hover:bg-[#30363d] dark:hover:text-[#f0f6fc]"
                    >
                      <Icon className="h-4 w-4 opacity-70" />

                      <span>{label}</span>
                    </a>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-end border-t border-slate-100 px-3.5 py-1 pt-3 text-[10px] font-bold text-slate-400 dark:border-[#30363d] dark:text-[#8b949e]">
                  <span className="tracking-tighter text-sky-500 uppercase">
                    GOPKG PROJECT
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
