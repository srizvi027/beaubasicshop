import Image from "next/image";
import Link from "next/link";
import { ImageReveal, Reveal } from "@/components/animations/Reveal";
import { Parallax } from "@/components/animations/Parallax";
import { MaskText } from "@/components/animations/MaskText";
import { ButtonLink } from "@/components/ui/Button";

export function EditorialBeauty() {
  return (
    <section aria-label="Discover your next beauty obsession" className="relative overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-24 md:px-10 md:py-36 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6 lg:pt-10">
          <MaskText lines={["Discover", "your next", "beauty", "obsession."]} className="display text-[clamp(3.2rem,7.6vw,8.4rem)] text-plum" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:pl-[18%]">
            <Reveal>
              <p className="text-[1.02rem] leading-relaxed text-plum/75">
                Filipino skincare built for humid days. Japanese and Korean textures that sink in fast. Formulas loved across Asia, picked one by one for Australian skin and Australian sun.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="flex items-end">
              <ButtonLink href="/collections/skincare" variant="dark">Shop skincare</ButtonLink>
            </Reveal>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <ImageReveal className="relative ml-auto aspect-[4/5] w-[86%]">
            <Parallax amount={40} className="h-full w-full">
              <Image src="/images/editorial/you-glow-babe.webp" alt="Women in pink activewear laughing together with wellness products" fill sizes="(min-width: 1024px) 42vw, 86vw" className="object-cover" />
            </Parallax>
          </ImageReveal>
          <ImageReveal delay={0.25} className="absolute -bottom-10 left-0 aspect-square w-[44%] shadow-[0_30px_60px_-20px_rgba(40,26,57,0.35)] md:-bottom-16">
            <Image src="/images/products/eirian-peeling-fine-bar-2.webp" alt="Eirian Skin Peeling-Fine Bar" fill sizes="(min-width: 1024px) 20vw, 44vw" className="object-cover" />
          </ImageReveal>
          <Reveal delay={0.4} className="absolute -bottom-24 left-[47%] max-w-[16rem] md:-bottom-32">
            <p className="editorial text-lg leading-snug text-plum">AHA and papaya enzyme, in one gentle bar for face and body.</p>
            <Link href="/products/eirian-skin-peeling-fine-bar-70g" className="link-underline mt-2 inline-block text-xs font-semibold text-plum">Eirian Skin Peeling-Fine Bar — $20</Link>
          </Reveal>
        </div>
      </div>
      <div className="h-24 md:h-32" />
    </section>
  );
}
