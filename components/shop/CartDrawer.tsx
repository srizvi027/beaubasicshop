"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/store/cart";
import { useScrollLock } from "@/components/store/ui";
import { formatPrice } from "@/lib/pricing";
import { FREE_SHIPPING_THRESHOLD } from "@/data/site";
import { ProductImage } from "@/components/product/ProductImage";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { ButtonLink } from "@/components/ui/Button";

export function CartDrawer() {
  const { isOpen, close, lines, subtotal, count, setQuantity, removeItem, freeShippingRemaining, freeShippingProgress } = useCart();
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[75]">
          <motion.div className="absolute inset-0 bg-plum/45" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 className="display text-4xl">Your bag <sup className="align-super text-base font-semibold tabular-nums">{count}</sup></h2>
              <button onClick={close} aria-label="Close cart" autoFocus className="grid h-10 w-10 place-items-center rounded-full bg-mist transition hover:rotate-90 hover:bg-ink hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Free shipping progress */}
            <div className="mx-6 mb-2 bg-blush px-4 py-3.5">
              <p className="text-sm" aria-live="polite">
                {freeShippingRemaining > 0 ? (
                  <>You’re <strong className="tabular-nums">{formatPrice(freeShippingRemaining)}</strong> away from free shipping.</>
                ) : (
                  <>You’ve unlocked <strong>free standard shipping</strong>.</>
                )}
              </p>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={FREE_SHIPPING_THRESHOLD} aria-valuenow={Math.round(subtotal)}>
                <motion.div className="h-full origin-left rounded-full bg-pink" initial={false} animate={{ scaleX: freeShippingProgress }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <ShoppingBag className="h-10 w-10 text-pink" strokeWidth={1.2} />
                <p className="editorial text-2xl">Your bag is empty.</p>
                <p className="text-sm text-black/60">Start with our best sellers — they’re popular for a reason.</p>
                <ButtonLink href="/collections/best-sellers" variant="dark">Shop best sellers</ButtonLink>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-black/10 overflow-y-auto px-6">
                <AnimatePresence initial={false}>
                  {lines.map((line) => (
                    <motion.li
                      key={line.key}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex gap-4 overflow-hidden py-5"
                    >
                      <Link href={`/products/${line.slug}`} onClick={close} className="relative h-28 w-24 shrink-0 bg-mist">
                        <ProductImage src={line.image.src} alt={line.image.alt} fill sizes="96px" className="p-2" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-black/50">{line.brand}</p>
                        <Link href={`/products/${line.slug}`} onClick={close} className="mt-0.5 text-sm leading-snug hover:underline">{line.name}</Link>
                        {line.variantName && <p className="mt-0.5 text-xs text-black/55">{line.variantName}</p>}
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <QuantitySelector size="sm" value={line.quantity} onChange={(n) => setQuantity(line.key, n)} label={`Quantity for ${line.name}`} />
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</span>
                            <button onClick={() => removeItem(line.key)} aria-label={`Remove ${line.name}`} className="text-black/40 transition hover:text-pink">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {lines.length > 0 && (
              <footer className="border-t border-black/10 px-6 pb-6 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-xl font-semibold tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-black/55">Shipping and discount codes calculated at checkout.</p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-blue text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-cobalt"
                >
                  Checkout — {formatPrice(subtotal)}
                </Link>
                <button onClick={close} className="mt-3 w-full text-center text-sm text-black/60 underline-offset-4 hover:underline">Continue shopping</button>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
