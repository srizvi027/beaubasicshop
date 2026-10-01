import type { Metadata } from "next";
import { getAllProducts } from "@/lib/catalog";
import { WishlistView } from "@/components/shop/WishlistView";
import { CollectionHeader } from "@/components/shop/CollectionHeader";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default async function WishlistPage() {
  const products = await getAllProducts();
  return (
    <>
      <CollectionHeader title="Wishlist" description="Everything you’ve saved for later." crumbs={[{ name: "Home", href: "/" }, { name: "Wishlist", href: "/wishlist" }]} tone="#FFE4EC" />
      <div className="mx-auto max-w-[1600px] px-4 py-14 pb-28 md:px-10">
        <WishlistView products={products} />
      </div>
    </>
  );
}
