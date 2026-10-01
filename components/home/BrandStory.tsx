import Image from "next/image";
import { ImageReveal, Reveal } from "@/components/animations/Reveal";
import { Parallax } from "@/components/animations/Parallax";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";

export function BrandStory({ standalone = false }: { standalone?: boolean }) {
  return (
    <section aria-label="Our story" className="mx-auto max-w-[1600px] px-4 py-24 md:px-10 md:py-36">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-6">
        <div className="relative lg:col-span-5">
          <ImageReveal className="relative aspect-[3/4] w-[80%]">
            <Parallax amount={36} className="h-full w-full">
              <Image src="/images/products/hikari-pure-barley-plus-2.webp" alt="Pure Barley Plus box on blush pink" fill sizes="(min-width: 1024px) 32vw, 80vw" className="object-cover" />
            </Parallax>
          </ImageReveal>
          <ImageReveal delay={0.2} className="absolute -bottom-8 right-0 aspect-square w-[46%] bg-cream">
            <Image src="/images/products/luxe-organix-blotting-paper-3.webp" alt="Luxe Organix blotting paper" fill sizes="(min-width: 1024px) 18vw, 46vw" className="object-cover" />
          </ImageReveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
          <Reveal>
            <LogoMark className="h-14 w-auto text-pink" />
          </Reveal>
          <Reveal delay={0.1}>
            {standalone ? (
              <h1 className="mt-8 font-serif text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.12] tracking-[-0.02em]">
                Beau &amp; Basic curates Filipino and Asian beauty, skincare, body care, wellness and food for customers right across Australia.
              </h1>
            ) : (
              <p className="mt-8 font-serif text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.12] tracking-[-0.02em]">
                Beau &amp; Basic curates Filipino and Asian beauty, skincare, body care, wellness and food for customers right across Australia.
              </p>
            )}
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 grid gap-8 text-[1.02rem] leading-relaxed text-black/70 sm:grid-cols-2">
              <p>We stock the brands people already trust at home in the Philippines and across Asia — the ones that are hard to find on Australian shelves.</p>
              <p>Every order is picked and packed by hand in Gnowangerup, Western Australia, and sent out Australia-wide.</p>
            </div>
          </Reveal>
          {!standalone && (
            <Reveal delay={0.3}>
              <ButtonLink href="/about" variant="outline" className="mt-10">Read our story</ButtonLink>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
