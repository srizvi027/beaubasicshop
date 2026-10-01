import { getProductsByCategory } from "@/lib/catalog";
import { MaskText } from "@/components/animations/MaskText";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/animations/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";

/** Sari-sari store awning edge — a nod to the corner shops back home. */
function Awning() {
  return (
    <div aria-hidden className="relative h-16 w-full overflow-hidden md:h-20">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#FB6B90_0_48px,#EFEBE0_48px_96px)]" />
      {/* scalloped flaps: a half-circle hanging under every stripe */}
      <div className="absolute inset-x-0 bottom-0 h-6 bg-plum [background-image:radial-gradient(circle_at_24px_0,#FB6B90_23.5px,transparent_24px),radial-gradient(circle_at_72px_0,#EFEBE0_23.5px,transparent_24px)] [background-size:96px_24px] [background-repeat:repeat-x]" />
    </div>
  );
}

export async function FilipinoFood() {
  const products = await getProductsByCategory("filipino-food", 4);
  return (
    <section aria-label="A little taste of home" className="bg-plum text-cream">
      <Awning />
      <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-16 md:px-10 md:pb-32 md:pt-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <MaskText lines={["A little", "taste of home."]} className="display text-[clamp(3.2rem,8vw,8.6rem)]" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5 lg:pb-3">
            <p className="editorial text-2xl leading-snug text-cream/85">
              Choc Nut after school. Dried mangoes in every balikbayan box. Ube on everything.
            </p>
            <p className="mt-4 max-w-[46ch] text-cream/65">
              The snacks and pantry staples you grew up with, sent from our shelves in WA to your kitchen.
            </p>
            <ButtonLink href="/collections/filipino-food" variant="pink" className="mt-8">Shop Filipino Food</ButtonLink>
          </Reveal>
        </div>

        <StaggerChildren className="mt-16 grid grid-cols-2 gap-x-3 gap-y-10 text-cream sm:gap-x-5 lg:grid-cols-4 [&_.text-black\/50]:text-cream/55 [&_.text-black\/45]:text-cream/45">
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} tone="white" />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
