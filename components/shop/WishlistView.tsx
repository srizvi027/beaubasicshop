"use client";

import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/components/store/wishlist";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";

export function WishlistView({ products }: { products: Product[] }) {
  const { ids } = useWishlist();
  const saved = products.filter((p) => ids.includes(p.id));
  if (!saved.length)
    return (
      <div className="flex flex-col items-start gap-5 bg-mist p-10">
        <Heart className="h-9 w-9 text-pink" strokeWidth={1.3} />
        <p className="editorial text-3xl">Nothing saved yet.</p>
        <p className="text-black/60">Tap the heart on any product to keep it here.</p>
        <ButtonLink href="/collections/best-sellers" variant="dark">Browse best sellers</ButtonLink>
      </div>
    );
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
      {saved.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
    </ul>
  );
}
