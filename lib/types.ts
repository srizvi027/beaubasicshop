/**
 * Core commerce types.
 *
 * These describe the shape the UI expects. Whatever backend you use later
 * (Shopify, Sanity, Supabase, WooCommerce, Medusa…) only needs to be mapped
 * into these types inside a CatalogSource — no visual component changes.
 */

export type CategorySlug =
  | "skincare"
  | "beauty"
  | "hair-care"
  | "wellness"
  | "filipino-food"
  | "kids-family";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export type BadgeKind = "sale" | "new" | "bestseller" | "low-stock" | "sold-out" | "custom";

export interface ProductBadge {
  kind: BadgeKind;
  /** Optional custom text, e.g. "Staff pick" or "Back in stock" */
  label?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  /** Display name, e.g. "Medium", "70g", "Pack of 3", "Rosy Nude" */
  name: string;
  sku: string;
  /** Option values, e.g. { Shade: "Medium" } or { Size: "70g" } */
  options: Record<string, string>;
  /** Overrides the product price when set */
  price?: number;
  salePrice?: number;
  compareAtPrice?: number;
  stock?: StockStatus;
  /** Hex swatch for shade-style variants */
  swatch?: string;
  image?: ProductImage;
}

export interface Product {
  id: string;
  /** URL segment: /products/[slug]. Lowercase, hyphenated, unique. */
  slug: string;
  name: string;
  /** Brand slug — see data/brands.ts */
  brand: string;

  category: CategorySlug;
  subcategory?: string;

  /** Regular selling price in AUD */
  price: number;
  /** When set and lower than `price`, the product is on sale at this price */
  salePrice?: number;
  /** Optional RRP shown struck-through (e.g. "valued at") */
  compareAtPrice?: number;

  /** images[0] = main image, images[1] = hover image. The rest appear in the gallery. */
  images: ProductImage[];

  shortDescription: string;
  description: string;
  ingredients?: string;
  howToUse?: string;
  /** Quick facts shown as a list, e.g. ["Vegan", "70g x 2 bars"] */
  details?: string[];

  tags: string[];
  sku: string;
  stock: StockStatus;
  /** Optional units on hand — drives "Only X left" messaging */
  quantityAvailable?: number;

  /** Size shown on the card/page, e.g. "70g" */
  size?: string;

  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;

  variants?: ProductVariant[];
  /** Name of the variant option shown above the selector, e.g. "Shade" */
  variantLabel?: string;

  /** Extra badges on top of the automatic ones (sale/new/bestseller) */
  badges?: ProductBadge[];

  rating?: { average: number; count: number };

  /** Lower = sells more. Used for "Best selling" sort. */
  salesRank?: number;
  /** ISO date — used for "Newest" sort */
  createdAt: string;

  seo?: { title?: string; description?: string };
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  /** Short, punchy line for the editorial category cards */
  tagline: string;
  image: ProductImage;
  /** Card background colour on the home page */
  tone: string;
  subcategories: string[];
}

export interface Brand {
  slug: string;
  name: string;
  origin?: string;
}

/** Virtual collections that aren't categories */
export type CollectionSlug = CategorySlug | "all" | "best-sellers" | "new-arrivals" | "sale";

export interface Collection {
  slug: CollectionSlug;
  title: string;
  description: string;
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "best-selling";

export interface ProductFilterState {
  categories: CategorySlug[];
  brands: string[];
  price: [number, number] | null;
  inStockOnly: boolean;
  onSale: boolean;
  newArrivals: boolean;
  bestsellers: boolean;
  sort: SortKey;
}

export interface CartLine {
  /** product id + variant id */
  key: string;
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  brand: string;
  variantName?: string;
  image: ProductImage;
  unitPrice: number;
  quantity: number;
}
