import { products } from "@/data/products";
import type { CatalogSource } from "./source";

/** Reads products from data/products.ts */
export const localSource: CatalogSource = {
  async listProducts() {
    return products;
  },
  async getProductBySlug(slug) {
    return products.find((p) => p.slug === slug);
  },
};
