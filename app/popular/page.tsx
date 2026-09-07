import type { Metadata } from "next";

import { PopularPageContent } from "@/components/popular/PopularPageContent";

export const metadata: Metadata = {
  title: "Popular Packages",
  description:
    "Browse the most popular Go packages on GitHub, ranked by stars.",
  alternates: { canonical: "/popular" },
};

export default function PopularPage() {
  return <PopularPageContent />;
}
