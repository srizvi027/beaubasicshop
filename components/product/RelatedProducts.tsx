import type { Product } from "@/lib/types";
import { getRelatedProducts } from "@/lib/catalog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "./ProductGrid";

export async function RelatedProducts({ product }: { product: Product }) {
  const related = await getRelatedProducts(product, 4);
  if (!related.length) return null;
  return (
    <section aria-labelledby="related" className="mx-auto max-w-[1600px] px-4 py-24 md:px-10">
      <SectionHeading title="You might also love" />
      <div className="mt-12">
        <ProductGrid products={related} />
      </div>
    </section>
  );
}
