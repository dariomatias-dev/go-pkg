import {
  BookOpen,
  Box,
  Code,
  Globe,
  Heart,
  Scale,
  TrendingUp,
} from "lucide-react";

export const NAV_LINKS = [
  { href: "/popular", label: "Popular Modules", icon: TrendingUp },
  { href: "/compare", label: "Package Compare", icon: Scale },
  { href: "/favorites", label: "My Favorites", icon: Heart },
] as const;

export const ECOSYSTEM_LINKS = [
  { href: "https://go.dev", label: "Official Website", icon: Globe },
  { href: "https://go.dev/doc", label: "Documentation", icon: BookOpen },
  { href: "https://pkg.go.dev", label: "Packages Search", icon: Box },
  { href: "https://go.dev/ref/spec", label: "Language Spec", icon: Code },
] as const;
