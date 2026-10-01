import { getSaleProducts } from "@/lib/catalog";
import { MaskText } from "@/components/animations/MaskText";
import { Reveal } from "@/components/animations/Reveal";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { getPricing } from "@/lib/pricing";

export async function SaleSection() {
  const products = await getSaleProducts(3);
  if (!products.length) return null;
  const maxOff = Math.max(...products.map((p) => getPricing(p).discountPercent ?? 0));
  return (
    <section aria-label="Sale" className="relative overflow-hidden bg-blush">
      {/* oversized sale mark */}
      <p aria-hidden className="display pointer-events-none absolute -right-[2vw] -top-[3vw] select-none text-[34vw] leading-none text-pink/12">
        Sale
      </p>
      <div className="relative mx-auto max-w-[1600px] px-4 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <span className="inline-flex h-8 items-center rounded-full bg-pink px-4 text-xs font-bold text-white">Up to {maxOff}% off</span>
              </Reveal>
              <MaskText lines={["Favourites,", "softer", "prices."]} className="display mt-6 text-[clamp(3rem,6vw,6.4rem)] text-ink" />
              <Reveal delay={0.15}>
                <p className="mt-6 max-w-[34ch] text-black/70">Limited stock on selected beauty, body and pantry picks. When they’re gone, they’re gone.</p>
                <ButtonLink href="/collections/sale" className="mt-8">Shop the sale</ButtonLink>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-8">
            <ProductGrid products={products} columns={3} tone="white" />
          </div>
        </div>
      </div>
    </section>
  );
}
