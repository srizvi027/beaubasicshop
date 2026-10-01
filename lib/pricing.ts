import type { Product, ProductVariant } from "@/lib/types";

export interface Pricing {
  /** What the customer pays */
  current: number;
  /** Struck-through price, if any */
  original?: number;
  onSale: boolean;
  discountPercent?: number;
}

/**
 * Resolves the price to display for a product (optionally a specific variant).
 * Priority: variant.salePrice > variant.price > product.salePrice > product.price.
 */
export function getPricing(product: Product, variant?: ProductVariant): Pricing {
  const base = variant?.price ?? product.price;
  const sale = variant ? (variant.salePrice ?? (variant.price === undefined ? product.salePrice : undefined)) : product.salePrice;
  const compare = variant?.compareAtPrice ?? product.compareAtPrice;

  if (sale !== undefined && sale < base) {
    return { current: sale, original: base, onSale: true, discountPercent: Math.round((1 - sale / base) * 100) };
  }
  if (compare !== undefined && compare > base) {
    return { current: base, original: compare, onSale: false };
  }
  return { current: base, onSale: false };
}

export function formatPrice(value: number, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency, minimumFractionDigits: 2 }).format(value);
}
