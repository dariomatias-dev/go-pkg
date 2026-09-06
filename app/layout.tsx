import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/header/Header";
import { ScrollToTop } from "@/components/providers/ScrollToTop";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "optional",
});

export const metadata: Metadata = {
  title: "GoPkg",
  description:
    "Search and explore Go packages with GitHub repository insights.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="selection:bg-go-blue flex min-h-screen flex-col bg-[#F8FAFC] text-slate-900 transition-colors duration-300 selection:text-white dark:bg-[#0b0e14] dark:text-[#f0f6fc] dark:selection:bg-sky-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <div className="bg-go-blue h-16 border-b border-[#005a71]/50 dark:border-[#30363d] dark:bg-[#0d1117]" />
            }
          >
            <Header />
          </Suspense>

          <Suspense>
            <ScrollToTop />
          </Suspense>

          <TooltipProvider>
            <main className="flex flex-1 flex-col">{children}</main>
          </TooltipProvider>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
