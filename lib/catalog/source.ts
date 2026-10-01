import type { Product } from "@/lib/types";

/**
 * A CatalogSource is the ONLY place that knows where product data lives.
 *
 * To move to Shopify / Sanity / Supabase / WooCommerce / Medusa:
 *   1. Create e.g. lib/catalog/shopify-source.ts implementing this interface,
 *      mapping the API response into our `Product` type.
 *   2. Swap the export in lib/catalog/index.ts.
 * Nothing in /components needs to change.
 */
export interface CatalogSource {
  listProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  /** Optional server-side search. Falls back to in-memory search if omitted. */
  search?(query: string, limit?: number): Promise<Product[]>;
}
