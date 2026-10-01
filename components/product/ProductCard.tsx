"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { getPricing } from "@/lib/pricing";
import { getBrandName } from "@/data/brands";
import { useUI } from "@/components/store/ui";
import { Price } from "@/components/ui/Price";
import { ProductImage } from "./ProductImage";
import { ProductBadges } from "./ProductBadge";
import { WishlistButton } from "./WishlistButton";
import { AddToCartButton } from "./AddToCartButton";
import { cn } from "@/lib/cn";

export function ProductCard({
  product, priority = false, tone = "mist", className,
}: { product: Product; priority?: boolean; tone?: "mist" | "white" | "blush"; className?: string }) {
  const { openQuickView } = useUI();
  const pricing = getPricing(product);
  const [main, hover] = product.images;
  const hasVariants = !!product.variants?.length;
  const href = `/products/${product.slug}`;
  const bg = tone === "white" ? "bg-white" : tone === "blush" ? "bg-blush" : "bg-mist";

  return (
    <article className={cn("group/card relative flex flex-col", className)}>
      <div className={cn("relative aspect-[4/5] overflow-hidden", bg)}>
        <Link href={href} aria-label={product.name} className="absolute inset-0 block">
          <div className="absolute inset-[9%] transition-transform duration-[900ms] ease-[var(--ease-luxe)] group-hover/card:scale-[1.06]">
            <ProductImage
              src={main.src}
              alt={main.alt}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
              className={cn("transition-opacity duration-700", hover && "group-hover/card:opacity-0")}
            />
          </div>
          {hover && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/card:opacity-100">
              <ProductImage src={hover.src} alt="" fill blend={false} sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw" className="object-cover scale-[1.04] transition-transform duration-[1200ms] ease-[var(--ease-luxe)] group-hover/card:scale-100" />
            </div>
          )}
        </Link>

        <ProductBadges product={product} className="pointer-events-none absolute left-3 top-3" />

        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} name={product.name} className="h-9 w-9 rounded-full bg-white/90 backdrop-blur transition hover:scale-110" />
        </div>

        {/* Desktop hover actions */}
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-[calc(100%+12px)] gap-2 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover/card:translate-y-0 group-focus-within/card:translate-y-0 md:flex">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="flex h-11 flex-1 items-center justify-center gap-2 bg-white text-[0.72rem] font-semibold uppercase tracking-[0.08em] transition-colors hover:bg-ink hover:text-white"
          >
            <Eye className="h-4 w-4" /> Quick view
          </button>
          <div className="flex-1">
            {hasVariants ? (
              <button type="button" onClick={() => openQuickView(product)} className="h-11 w-full bg-blue text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-cobalt">
                Choose {product.variantLabel?.toLowerCase() ?? "option"}
              </button>
            ) : (
              <AddToCartButton product={product} appearance="bar" />
            )}
          </div>
        </div>

        {/* Touch quick add */}
        <div className="absolute bottom-3 right-3 md:hidden">
          {hasVariants ? (
            <button type="button" onClick={() => openQuickView(product)} aria-label={`Choose options for ${product.name}`} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-[0_2px_10px_rgba(40,26,57,0.12)]">
              <Eye className="h-4 w-4" />
            </button>
          ) : (
            <AddToCartButton product={product} appearance="icon" />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 pt-4">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.1em] text-black/50">{getBrandName(product.brand)}</p>
        <h3 className="text-[0.95rem] leading-snug">
          <Link href={href} className="link-underline">{product.name}</Link>
        </h3>
        <Price pricing={pricing} className="mt-1" />
      </div>
    </article>
  );
}
