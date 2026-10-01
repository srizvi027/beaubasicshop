import { getBestSellers } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export async function BestSellers() {
  const products = await getBestSellers(8);
  return (
    <section aria-label="Best sellers" className="mx-auto max-w-[1600px] px-4 pb-24 md:px-10 md:pb-32">
      <SectionHeading
        title="Best sellers"
        subtitle="The products everyone is reaching for."
        action={<ButtonLink href="/collections/best-sellers" variant="outline">Shop all best sellers</ButtonLink>}
      />
      <div className="mt-12 md:mt-16">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
