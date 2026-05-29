"use client";

import {
  BookOpen,
  Box,
  ChevronDown,
  Code,
  Globe,
  Heart,
  Moon,
  Scale,
  Sun,
  Terminal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { HeaderSearch } from "@/components/layout/header/HeaderSearch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const ECOSYSTEM_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "https://go.dev", label: "Official Website", icon: Globe },
  { href: "https://go.dev/doc", label: "Documentation", icon: BookOpen },
  { href: "https://pkg.go.dev", label: "Packages Search", icon: Box },
  { href: "https://go.dev/ref/spec", label: "Language Spec", icon: Code },
];

export function Header() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { favorites } = useFavorites();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/popular", label: "Popular Modules", icon: TrendingUp, badge: undefined as number | undefined },
    { href: "/compare", label: "Package Compare", icon: Scale, badge: undefined },
    { href: "/favorites", label: "My Favorites", icon: Heart, badge: favorites.length || undefined },
  ];

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
    <header className="sticky top-0 z-100 bg-go-blue dark:bg-[#0d1117] shadow-md select-none border-b border-[#005a71]/50 dark:border-[#30363d] h-16 w-full transition-colors duration-300">
      <div className="container-scale h-full flex items-center justify-between gap-6">
        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/"
            className="bg-white dark:bg-[#161b22] p-1.5 rounded-lg flex items-center justify-center shadow-inner hover:scale-105 transition-transform border border-white/20 dark:border-[#30363d]"
          >
            <Terminal className="w-5 h-5 text-go-blue dark:text-sky-400 stroke-[2.5]" />
          </Link>

          <Link
            href="/"
            className="font-display font-black text-xl tracking-tight text-white dark:text-[#f0f6fc] hover:opacity-90 transition-opacity"
          >
            GoPkg
          </Link>
        </div>

        <HeaderSearch onSearch={() => setMenuOpen(false)} />

        <div className="flex items-center gap-3 shrink-0">
          <TooltipProvider>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-9 w-9 text-white dark:text-[#8b949e] hover:bg-white dark:hover:bg-[#30363d] border border-sky-400/20 dark:border-[#30363d] rounded-full focus-visible:ring-0 transition-all"
                    >
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>

                <TooltipContent>Change theme</TooltipContent>
              </Tooltip>

              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-40 p-1.5 rounded-2xl bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] shadow-2xl z-110"
              >
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="px-3 py-2 rounded-xl cursor-pointer text-sm font-medium dark:text-[#c9d1d9] dark:focus:bg-[#21262d] dark:focus:text-[#f0f6fc]"
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="px-3 py-2 rounded-xl cursor-pointer text-sm font-medium dark:text-[#c9d1d9] dark:focus:bg-[#21262d] dark:focus:text-[#f0f6fc]"
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="px-3 py-2 rounded-xl cursor-pointer text-sm font-medium dark:text-[#c9d1d9] dark:focus:bg-[#21262d] dark:focus:text-[#f0f6fc]"
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 px-4 py-1.5 bg-[#005a71] dark:bg-[#21262d] border border-sky-400/30 dark:border-[#30363d] rounded-full text-white dark:text-[#c9d1d9] font-bold text-sm transition-all hover:bg-[#004d61] dark:hover:bg-[#30363d] dark:hover:text-[#f0f6fc] active:scale-95 shadow-sm"
            >
              <span>Menu</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-300",
                  menuOpen && "rotate-180",
                )}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-72 max-h-[calc(100vh-80px)] overflow-y-auto bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-110 p-3 animate-in fade-in zoom-in-95 slide-in-from-top-2">
                <div className="md:hidden">
                  <p className="px-3.5 py-2 text-[10px] font-black text-slate-400 dark:text-[#8b949e] uppercase tracking-widest">
                    Search
                  </p>
                  <HeaderSearch mobile onSearch={() => setMenuOpen(false)} />
                </div>

                <div className="space-y-1 mb-4">
                  <p className="px-3.5 py-2 text-[10px] font-black text-slate-400 dark:text-[#8b949e] uppercase tracking-widest">
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
                        <Icon className="w-4 h-4 opacity-70" />
                        <span>{label}</span>
                      </div>
                      {badge !== undefined && (
                        <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-black">
                          {badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="px-3.5 py-2 text-[10px] font-black text-slate-400 dark:text-[#8b949e] uppercase tracking-widest">
                    Go Ecosystem
                  </p>
                  {ECOSYSTEM_LINKS.map(({ href, label, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-[#c9d1d9] hover:bg-slate-100 dark:hover:bg-[#30363d] dark:hover:text-[#f0f6fc] transition-all"
                    >
                      <Icon className="w-4 h-4 opacity-70" />
                      <span>{label}</span>
                    </a>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#30363d] px-3.5 py-1 flex justify-end items-center text-[10px] text-slate-400 dark:text-[#8b949e] font-bold">
                  <span className="text-sky-500 uppercase tracking-tighter">
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
