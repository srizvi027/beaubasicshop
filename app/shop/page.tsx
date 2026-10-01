import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts, searchProducts } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { ShopView } from "@/components/shop/ShopView";
import { CollectionHeader } from "@/components/shop/CollectionHeader";

export const metadata: Metadata = buildMetadata({
  title: "Shop all",
  description: "Shop Filipino and Asian beauty, skincare, hair care, wellness and food, delivered Australia-wide.",
  path: "/shop",
});

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const products = q ? await searchProducts(q, 500) : await getAllProducts();
  return (
    <>
      <CollectionHeader
        title={q ? `“${q}”` : "Shop all"}
        description={q ? `${products.length} result${products.length === 1 ? "" : "s"}` : "Everything we stock, from Manila to your mailbox."}
        crumbs={[{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }]}
      />
      <div className="mx-auto max-w-[1600px] px-4 pb-28 md:px-10">
        <Suspense>
          <ShopView products={products} query={q} />
        </Suspense>
      </div>
    </>
  );
}
