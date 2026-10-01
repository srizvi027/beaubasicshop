import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Loyalty } from "@/components/home/Loyalty";
import { Newsletter } from "@/components/home/Newsletter";

export const metadata: Metadata = buildMetadata({ title: "Beau Points loyalty", description: "Earn 1 point per $1, plus bonus points on sign-up, your birthday and more.", path: "/loyalty" });

export default function LoyaltyPage() {
  return (
    <>
      <h1 className="sr-only">Beau Points loyalty program</h1>
      <Loyalty />
      <Newsletter />
    </>
  );
}
