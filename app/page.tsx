import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { BestSellers } from "@/components/home/BestSellers";
import { EditorialBeauty } from "@/components/home/EditorialBeauty";
import { FilipinoFood } from "@/components/home/FilipinoFood";
import { SaleSection } from "@/components/home/SaleSection";
import { BrandStory } from "@/components/home/BrandStory";
import { Loyalty } from "@/components/home/Loyalty";
import { SocialGrid } from "@/components/home/SocialGrid";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <BestSellers />
      <EditorialBeauty />
      <FilipinoFood />
      <SaleSection />
      <BrandStory />
      <Loyalty />
      <SocialGrid />
      <Newsletter />
    </>
  );
}
