import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { BrandStory } from "@/components/home/BrandStory";
import { Loyalty } from "@/components/home/Loyalty";
import { SocialGrid } from "@/components/home/SocialGrid";

export const metadata: Metadata = buildMetadata({
  title: "Our story",
  description: "Beau & Basic curates Filipino and Asian beauty, skincare, wellness and food, shipped Australia-wide from Gnowangerup, WA.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <BrandStory standalone />
      <Loyalty />
      <SocialGrid />
    </>
  );
}
