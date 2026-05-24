import { CategoriesSection } from "@/components/home/CategoriesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PopularPackageSection } from "@/components/home/PopularPackageSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <CategoriesSection />

      <PopularPackageSection />
    </>
  );
}
