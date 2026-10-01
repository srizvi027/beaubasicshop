"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/categories";
import type { Category } from "@/lib/types";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

/** Three staggered columns of tall + short editorial cards. Swipeable row on mobile. */
const columns: { slug: Category["slug"]; tall: boolean }[][] = [
  [{ slug: "skincare", tall: true }, { slug: "hair-care", tall: false }],
  [{ slug: "beauty", tall: false }, { slug: "wellness", tall: true }],
  [{ slug: "filipino-food", tall: true }, { slug: "kids-family", tall: false }],
];

export function CategoryShowcase() {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  return (
    <section aria-labelledby="cat-heading" className="mx-auto max-w-[1600px] px-4 py-24 md:px-10 md:py-32">
      <div id="cat-heading">
        <SectionHeading lines={["Shop by", "category"]} subtitle="Six aisles, one very good basket." />
      </div>

      {/* Mobile: swipe row */}
      <div className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:hidden">
        {categories.map((c) => (
          <CategoryCard key={c.slug} category={c} className="h-[440px] w-[78vw] shrink-0 snap-start" />
        ))}
      </div>

      {/* Desktop: staggered mosaic */}
      <div className="mt-16 hidden grid-cols-3 gap-5 md:grid">
        {columns.map((col, ci) => (
          <div key={ci} className={cn("flex flex-col gap-5", ci === 1 && "pt-24")}>
            {col.map(({ slug, tall }, i) => (
              <Reveal key={slug} delay={ci * 0.08 + i * 0.1}>
                <CategoryCard category={bySlug.get(slug)!} className={tall ? "h-[620px]" : "h-[400px]"} />
              </Reveal>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category, className }: { category: Category; className?: string }) {
  const svg = category.image.src.endsWith(".svg");
  const dark = category.tone === "#281A39" || !svg;
  return (
    <Link
      href={`/collections/${category.slug}`}
      className={cn("group relative block overflow-hidden", className)}
      style={{ background: category.tone }}
    >
      <Image
        src={category.image.src}
        alt={category.image.alt}
        fill
        unoptimized={svg}
        sizes="(min-width: 768px) 33vw, 78vw"
        className={cn(
          "transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.07]",
          svg ? "object-contain p-[12%] pb-[30%]" : "object-cover",
        )}
      />
      {/* overlay deepens on hover */}
      <div className={cn("absolute inset-0 transition-opacity duration-700", dark ? "bg-linear-to-t from-plum/80 via-plum/10 to-transparent group-hover:from-plum/90" : "opacity-0")} />
      <div className={cn("absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-7", dark ? "text-white" : "text-ink")}>
        <div className="transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:-translate-y-1.5">
          <h3 className="display text-[clamp(2.4rem,3.6vw,3.6rem)]">{category.name}</h3>
          <p className={cn("editorial mt-2 max-w-[26ch] text-lg leading-snug", dark ? "text-white/80" : "text-black/65")}>{category.tagline}</p>
        </div>
        <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-500", dark ? "bg-white text-ink group-hover:bg-pink group-hover:text-white" : "bg-ink text-white group-hover:bg-blue")}>
          <ArrowRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-45" />
          <span className="sr-only">Shop {category.name}</span>
        </span>
      </div>
    </Link>
  );
}
