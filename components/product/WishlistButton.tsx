"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/components/store/wishlist";
import { cn } from "@/lib/cn";

export function WishlistButton({ productId, name, className, withLabel = false }: { productId: string; name: string; className?: string; withLabel?: boolean }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);
  const [burst, setBurst] = useState(0);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (toggle(productId)) setBurst((b) => b + 1);
      }}
      className={cn("relative inline-flex items-center justify-center gap-2", className)}
    >
      <span className="relative inline-flex">
        <motion.span key={burst} initial={burst ? { scale: 0.6 } : false} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }}>
          <Heart className={cn("h-[18px] w-[18px] transition-colors", active ? "fill-pink text-pink" : "text-ink")} strokeWidth={1.6} />
        </motion.span>
        <AnimatePresence>
          {burst > 0 && active && (
            <motion.span key={`b${burst}`} className="pointer-events-none absolute inset-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-pink"
                    initial={{ x: "-50%", y: "-50%" }}
                    animate={{ x: `calc(-50% + ${Math.cos(a) * 16}px)`, y: `calc(-50% + ${Math.sin(a) * 16}px)` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                );
              })}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {withLabel && <span className="text-sm">{active ? "Saved" : "Save to wishlist"}</span>}
    </button>
  );
}
