"use client";

import Link from "next/link";
import { useCart } from "@/components/store/cart";
import { formatPrice } from "@/lib/pricing";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from "@/data/site";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Order summary. The "Pay" button is where your ecommerce backend's hosted
 * checkout goes (Shopify checkoutUrl, Stripe Checkout, WooCommerce, Medusa…).
 */
export function CheckoutView() {
  const { lines, subtotal, setQuantity, removeItem } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_COST;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-14 pb-28 md:px-10">
      <h1 className="display text-[clamp(3rem,8vw,7rem)]">Checkout</h1>
      {!lines.length ? (
        <div className="mt-10 flex flex-col items-start gap-5 bg-mist p-10">
          <p className="editorial text-3xl">Your bag is empty.</p>
          <ButtonLink href="/shop" variant="dark">Start shopping</ButtonLink>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-black/10 border-y border-black/10">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-5 py-6">
                <Link href={`/products/${l.slug}`} className="relative h-32 w-28 shrink-0 bg-mist"><ProductImage src={l.image.src} alt={l.image.alt} fill sizes="112px" className="p-2" /></Link>
                <div className="flex flex-1 flex-col">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-black/50">{l.brand}</p>
                  <p>{l.name}</p>
                  {l.variantName && <p className="text-sm text-black/55">{l.variantName}</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantitySelector size="sm" value={l.quantity} onChange={(n) => setQuantity(l.key, n)} />
                    <button onClick={() => removeItem(l.key)} className="text-sm text-black/50 underline underline-offset-4 hover:text-pink">Remove</button>
                  </div>
                </div>
                <p className="font-semibold tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</p>
              </li>
            ))}
          </ul>
          <aside className="h-fit bg-mist p-7">
            <h2 className="text-sm font-semibold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Standard shipping</dt><dd className="tabular-nums">{shipping ? formatPrice(shipping) : "Free"}</dd></div>
              <div className="flex justify-between border-t border-black/10 pt-3 text-lg font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatPrice(subtotal + shipping)}</dd></div>
            </dl>
            <label className="mt-6 block text-sm">
              <span className="mb-2 block font-semibold">Discount code</span>
              <input placeholder="BEAU10" className="h-12 w-full border border-black/15 bg-white px-4 uppercase focus:border-ink focus:outline-none" />
            </label>
            <button className="mt-6 h-14 w-full rounded-full bg-blue text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white hover:bg-cobalt">Pay {formatPrice(subtotal + shipping)}</button>
            <p className="mt-3 text-center text-xs text-black/50">Demo checkout — connect your payment provider here. Afterpay available.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
