import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/header/Header";

export const metadata: Metadata = {
  title: "GoPkg",
  description:
    "Search and explore Go packages with GitHub repository insights.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 selection:bg-go-blue selection:text-white flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
