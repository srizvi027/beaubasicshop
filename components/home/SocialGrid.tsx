import Image from "next/image";
import { site } from "@/data/site";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerChildren, StaggerItem } from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

/** Replace these with real Instagram posts (or an Instagram feed API) when available. */
const posts = [
  { src: "/images/editorial/you-glow-babe.webp", alt: "Campaign shoot in pink", cls: "row-span-2 object-[50%_30%]" },
  { src: "/images/products/eirian-peeling-fine-bar-2.webp", alt: "Peeling-Fine Bar flatlay", cls: "" },
  { src: "/images/products/bys-compact-powder-medium-3.webp", alt: "Compact powder close-up", cls: "" },
  { src: "/images/products/hikari-pure-barley-plus-2.webp", alt: "Pure Barley Plus on pink", cls: "row-span-2" },
  { src: "/images/products/luxe-organix-blotting-paper-3.webp", alt: "Blotting paper detail", cls: "" },
  { src: "/images/products/eirian-peeling-fine-bar-3.webp", alt: "Peeling-Fine Bar on cream", cls: "" },
];

export function SocialGrid() {
  return (
    <section aria-label="Instagram" className="mx-auto max-w-[1600px] px-4 py-24 md:px-10 md:py-32">
      <SectionHeading
        title={`@${site.instagram}`}
        subtitle="Unboxings, routines and new arrivals, as they land."
        action={
          <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="group inline-flex h-13 items-center gap-3 rounded-full bg-ink px-7 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-pink">
            <InstagramIcon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" /> Follow @{site.instagram}
          </a>
        }
      />
      <StaggerChildren className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4 md:auto-rows-[230px]">
        {posts.map((p) => (
          <StaggerItem key={p.src} className={cn("group relative overflow-hidden bg-mist", p.cls.includes("row-span-2") && "row-span-2")}>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label={`View on Instagram: ${p.alt}`} className="absolute inset-0">
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className={cn("object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]", p.cls.replace("row-span-2", ""))} />
              <span className="absolute inset-0 grid place-items-center bg-plum/0 text-white opacity-0 transition duration-500 group-hover:bg-plum/35 group-hover:opacity-100">
                <InstagramIcon className="h-8 w-8" />
              </span>
            </a>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}
