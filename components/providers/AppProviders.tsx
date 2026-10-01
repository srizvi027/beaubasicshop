"use client";

import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/components/store/cart";
import { WishlistProvider } from "@/components/store/wishlist";
import { UIProvider } from "@/components/store/ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    // reducedMotion="user" makes every Framer animation respect prefers-reduced-motion
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      <UIProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </UIProvider>
    </MotionConfig>
  );
}
