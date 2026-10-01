"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product, ProductVariant } from "@/lib/types";
import { getPricing } from "@/lib/pricing";
import { getBrandName } from "@/data/brands";
import { useScrollLock, useUI } from "@/components/store/ui";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { ProductImage } from "./ProductImage";
import { ProductBadges } from "./ProductBadge";
import { VariantSelector } from "./VariantSelector";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";

/** Mounted once in the root layout; opened from any ProductCard. */
export function ProductQuickView() {
  const { quickView, closeQuickView } = useUI();
  useScrollLock(!!quickView);

  useEffect(() => {
    if (!quickView) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuickView();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickView, closeQuickView]);

  return (
    <AnimatePresence>
      {quickView && (
        <motion.div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-plum/55" onClick={closeQuickView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${quickView.name}`}
            className="relative grid max-h-[92vh] w-full max-w-5xl overflow-y-auto bg-white md:grid-cols-2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuickViewBody key={quickView.id} product={quickView} onClose={closeQuickView} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickViewBody({ product, onClose }: { product: Product; onClose: () => void }) {
  const [variant, setVariant] = useState<ProductVariant | undefined>(product.variants?.find((v) => v.stock !== "out_of_stock"));
  const [qty, setQty] = useState(1);
  const pricing = getPricing(product, variant);

  return (
    <>
      <button onClick={onClose} aria-label="Close quick view" autoFocus className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white transition hover:rotate-90 hover:bg-ink hover:text-white">
        <X className="h-4 w-4" />
      </button>
      <div className="relative aspect-square bg-mist md:aspect-auto md:min-h-[560px]">
        <motion.div className="absolute inset-[10%]" initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <ProductImage src={(variant?.image ?? product.images[0]).src} alt={product.images[0].alt} fill sizes="(min-width: 768px) 40vw, 100vw" />
        </motion.div>
        <ProductBadges product={product} className="absolute left-4 top-4" />
      </div>
      <div className="flex flex-col gap-5 p-6 md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/55">{getBrandName(product.brand)}</p>
          <h2 className="display mt-2 text-4xl">{product.name}</h2>
        </div>
        <Rating rating={product.rating} />
        <Price pricing={pricing} size="lg" />
        <p className="leading-relaxed text-black/70">{product.shortDescription}</p>
        <VariantSelector product={product} value={variant} onChange={setVariant} />
        <div className="flex flex-wrap items-center gap-3">
          <QuantitySelector value={qty} onChange={setQty} />
          <AddToCartButton product={product} variant={variant} quantity={qty} className="flex-1" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Link href={`/products/${product.slug}`} onClick={onClose} className="group inline-flex items-center gap-1.5 text-sm font-semibold">
            <span className="link-underline">View full product</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <WishlistButton productId={product.id} name={product.name} withLabel />
        </div>
      </div>
    </>
  );
}
