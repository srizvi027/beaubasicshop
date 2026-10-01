"use client";

import { RotateCcw, Truck, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product, ProductVariant } from "@/lib/types";
import { formatPrice, getPricing } from "@/lib/pricing";
import { getBrandName } from "@/data/brands";
import { FREE_SHIPPING_THRESHOLD } from "@/data/site";
import { useCart } from "@/components/store/cart";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { Accordion } from "@/components/ui/Accordion";
import { AddToCartButton } from "./AddToCartButton";
import { QuantitySelector } from "./QuantitySelector";
import { VariantSelector } from "./VariantSelector";
import { WishlistButton } from "./WishlistButton";
import { ProductBadges } from "./ProductBadge";

const stockCopy: Record<Product["stock"], { text: string; dot: string }> = {
  in_stock: { text: "In stock, ready to ship", dot: "bg-emerald-500" },
  low_stock: { text: "Low stock", dot: "bg-amber-500" },
  out_of_stock: { text: "Sold out", dot: "bg-black/30" },
  preorder: { text: "Available for pre-order", dot: "bg-blue" },
};

export function ProductDetails({ product }: { product: Product }) {
  const firstAvailable = product.variants?.find((v) => v.stock !== "out_of_stock") ?? product.variants?.[0];
  const [variant, setVariant] = useState<ProductVariant | undefined>(firstAvailable);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();

  const pricing = getPricing(product, variant);
  const stock = variant?.stock ?? product.stock;
  const soldOut = stock === "out_of_stock";
  const sc = stockCopy[stock];

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <ProductBadges product={product} />
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-black/55">{getBrandName(product.brand)}</p>
        <h1 className="display text-[clamp(2.4rem,4.4vw,4rem)]">{product.name}</h1>
        <Rating rating={product.rating} />
      </div>

      <div className="flex flex-col gap-2">
        <Price pricing={pricing} size="lg" />
        <p className="text-xs text-black/55">
          GST included. Or 4 interest-free payments of {formatPrice(pricing.current / 4)} with Afterpay.
        </p>
      </div>

      <p className="max-w-prose text-[1.02rem] leading-relaxed text-black/75">{product.shortDescription}</p>

      <VariantSelector product={product} value={variant} onChange={setVariant} />

      <p className="flex items-center gap-2 text-sm">
        <span className={`h-2 w-2 rounded-full ${sc.dot}`} />
        {stock === "low_stock" && product.quantityAvailable ? `Only ${product.quantityAvailable} left` : sc.text}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector value={qty} onChange={setQty} max={product.quantityAvailable ?? 99} />
        <AddToCartButton product={product} variant={variant} quantity={qty} className="flex-1" />
      </div>
      <div className="-mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={soldOut}
          onClick={() => { addItem(product, { variant, quantity: qty, openDrawer: false }); router.push("/checkout"); }}
          className="h-13 flex-1 rounded-full bg-ink px-8 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-plum disabled:opacity-30"
        >
          Buy now
        </button>
        <WishlistButton productId={product.id} name={product.name} withLabel className="h-13 rounded-full border border-black/15 px-6 hover:border-ink" />
      </div>

      <ul className="grid gap-3 border-y border-black/10 py-5 text-sm sm:grid-cols-3">
        <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-blue" /> Free shipping over ${FREE_SHIPPING_THRESHOLD}</li>
        <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue" /> Authentic products</li>
        <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-blue" /> Easy returns</li>
      </ul>

      <Accordion
        items={[
          {
            title: "Description",
            content: (
              <>
                <p>{product.description}</p>
                {product.details && (
                  <ul className="mt-4 list-disc space-y-1 pl-5">{product.details.map((d) => <li key={d}>{d}</li>)}</ul>
                )}
              </>
            ),
          },
          { title: "Ingredients", content: <p>{product.ingredients ?? "Please refer to the product packaging for the full ingredient list."}</p> },
          { title: "How to use", content: <p>{product.howToUse ?? "Use as directed on the packaging."}</p> },
          {
            title: "Shipping",
            content: <p>Dispatched from Gnowangerup, WA within 1–2 business days. Free standard shipping on orders over ${FREE_SHIPPING_THRESHOLD}; otherwise a flat $10.95 Australia-wide.</p>,
          },
          {
            title: "Returns",
            content: <p>Unopened items can be returned within 14 days. If anything arrives damaged, email us within 7 days and we’ll make it right.</p>,
          },
        ]}
      />
      <p className="text-xs text-black/45">SKU {variant?.sku ?? product.sku}</p>
    </div>
  );
}
