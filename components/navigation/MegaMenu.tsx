"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MegaMenuData } from "@/lib/catalog";
import type { CategorySlug } from "@/lib/types";
import { categories, categoryMap } from "@/data/categories";
import { getPricing, formatPrice } from "@/lib/pricing";
import { ProductImage } from "@/components/product/ProductImage";

export function MegaMenu({ kind, category, data, onNavigate }: { kind: "shop" | "category"; category?: string; data: MegaMenuData; onNavigate: () => void }) {
  const cat = category ? categoryMap.get(category as CategorySlug) : undefined;
  const block = kind === "shop" || !cat ? data.shop : data.byCategory[cat.slug];
  const title = cat ? cat.name : "Shop";
  const href = cat ? `/collections/${cat.slug}` : "/shop";
  const editorial = cat?.image ?? { src: "/images/editorial/you-glow-babe.webp", alt: "Beau & Basic campaign" };

  const col = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-full border-t border-black/10 bg-white shadow-[0_30px_60px_-30px_rgba(40,26,57,0.35)]"
    >
      <motion.div
        className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-10 py-10"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.05, delayChildren: 0.08 }}
      >
        <motion.div variants={col} className="col-span-2">
          <p className="mb-4 text-xs font-semibold text-black/45">{cat ? "Shop by type" : "Categories"}</p>
          <ul className="space-y-2.5">
            {(cat ? cat.subcategories.map((s) => ({ label: s, href: `/collections/${cat.slug}?sub=${encodeURIComponent(s)}` })) : categories.map((c) => ({ label: c.name, href: `/collections/${c.slug}` }))).map((l) => (
              <li key={l.href}><Link href={l.href} onClick={onNavigate} className="link-underline text-[0.95rem]">{l.label}</Link></li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={col} className="col-span-2">
          <p className="mb-4 text-xs font-semibold text-black/45">Brands</p>
          <ul className="space-y-2.5">
            {block.brands.slice(0, 7).map((b) => (
              <li key={b.slug}><Link href={`/shop?brand=${b.slug}`} onClick={onNavigate} className="link-underline text-[0.95rem]">{b.name}</Link></li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={col} className="col-span-4">
          <p className="mb-4 text-xs font-semibold text-black/45">Featured</p>
          <div className="grid grid-cols-2 gap-4">
            {block.featured.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} onClick={onNavigate} className="group block">
                <div className="relative aspect-square overflow-hidden bg-mist">
                  <ProductImage src={p.images[0].src} alt={p.images[0].alt} fill sizes="200px" className="p-5 transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-2 text-sm leading-snug">{p.name}</p>
                <p className="text-sm font-semibold tabular-nums">{formatPrice(getPricing(p).current)}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div variants={col} className="col-span-4">
          <Link href={href} onClick={onNavigate} className="group relative block aspect-[16/11] overflow-hidden" style={{ background: cat?.tone ?? "#FFE4EC" }}>
            <Image src={editorial.src} alt={editorial.alt} fill sizes="400px" unoptimized={editorial.src.endsWith(".svg")} className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-t from-plum/70 via-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-white">
              <div>
                <p className="display text-4xl">{title}</p>
                {cat && <p className="editorial mt-1 text-lg text-white/85">{cat.tagline}</p>}
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink">
                Shop all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
