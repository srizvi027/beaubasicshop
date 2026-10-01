import type { Product, ProductBadge as Badge } from "@/lib/types";
import { getPricing } from "@/lib/pricing";
import { cn } from "@/lib/cn";

const tone: Record<Badge["kind"], string> = {
  sale: "bg-pink text-white",
  new: "bg-blue text-white",
  bestseller: "bg-ink text-white",
  "low-stock": "bg-blush text-plum",
  "sold-out": "bg-white text-black/60 border border-black/10",
  custom: "bg-cream text-plum",
};

/** Automatic badges from product data + any custom ones. Max 2 shown. */
export function getBadges(product: Product): (Badge & { text: string })[] {
  const pricing = getPricing(product);
  const list: (Badge & { text: string })[] = [];
  if (product.stock === "out_of_stock") list.push({ kind: "sold-out", text: "Sold out" });
  if (pricing.onSale) list.push({ kind: "sale", text: `${pricing.discountPercent}% off` });
  if (product.newArrival) list.push({ kind: "new", text: "New" });
  if (product.bestseller) list.push({ kind: "bestseller", text: "Best seller" });
  if (product.stock === "low_stock") list.push({ kind: "low-stock", text: product.quantityAvailable ? `Only ${product.quantityAvailable} left` : "Low stock" });
  product.badges?.forEach((b) => list.push({ ...b, text: b.label ?? b.kind }));
  return list.slice(0, 2);
}

export function ProductBadge({ badge, className }: { badge: Badge & { text: string }; className?: string }) {
  return (
    <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-[0.68rem] font-semibold tracking-[0.02em]", tone[badge.kind], className)}>
      {badge.text}
    </span>
  );
}

export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  const badges = getBadges(product);
  if (!badges.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((b) => <ProductBadge key={b.kind + b.text} badge={b} />)}
    </div>
  );
}
