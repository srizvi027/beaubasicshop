"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product, ProductVariant } from "@/lib/types";
import { useCart } from "@/components/store/cart";
import { cn } from "@/lib/cn";

type State = "idle" | "added";

/**
 * Add to cart with a polished confirmation:
 * "ADD TO CART" → "ADDED ✓" → back again. Opens the cart drawer.
 * `variant="icon"` renders a compact round quick-add button for cards.
 */
export function AddToCartButton({
  product, variant, quantity = 1, appearance = "full", className, openDrawer = true, label = "Add to cart",
}: {
  product: Product;
  variant?: ProductVariant;
  quantity?: number;
  appearance?: "full" | "bar" | "icon";
  className?: string;
  openDrawer?: boolean;
  label?: string;
}) {
  const { addItem } = useCart();
  const [state, setState] = useState<State>("idle");
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const soldOut = (variant?.stock ?? product.stock) === "out_of_stock";

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut || state === "added") return;
    addItem(product, { variant, quantity, openDrawer });
    setState("added");
    timer.current = window.setTimeout(() => setState("idle"), 1600);
  };

  if (appearance === "icon") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        disabled={soldOut}
        whileTap={{ scale: 0.88 }}
        aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} to cart`}
        className={cn("grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-[0_2px_10px_rgba(40,26,57,0.12)] transition-colors", state === "added" && "bg-blue text-white", className)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={state} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.2 }}>
            {state === "added" ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={soldOut}
      whileTap={{ scale: 0.97 }}
      aria-live="polite"
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden font-semibold uppercase tracking-[0.08em] transition-colors duration-300",
        appearance === "full" ? "h-13 rounded-full px-8 text-[0.8rem]" : "h-11 w-full text-[0.72rem]",
        soldOut ? "bg-fog text-black/40" : state === "added" ? "bg-ink text-white" : "bg-blue text-white hover:bg-cobalt",
        className,
      )}
    >
      {/* sweep */}
      <AnimatePresence>
        {state === "added" && (
          <motion.span
            className="absolute inset-0 origin-left bg-ink"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={soldOut ? "sold" : state}
          className="relative flex items-center gap-2"
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {soldOut ? "Sold out" : state === "added" ? <>Added <Check className="h-4 w-4" strokeWidth={2.5} /></> : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
