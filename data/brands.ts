import type { Brand } from "@/lib/types";

/**
 * Brands. A product's `brand` field must match one of these slugs.
 * Add a brand once here, then reference it from any product.
 */
export const brands: Brand[] = [
  { slug: "hikari-skin-essentials", name: "Hikari Skin Essentials", origin: "Philippines" },
  { slug: "bys", name: "BYS", origin: "Australia" },
  { slug: "eirian-skin", name: "Eirian Skin", origin: "Philippines" },
  { slug: "luxe-organix", name: "Luxe Organix", origin: "Philippines" },
  // ---- Demo brands (used by placeholder products) ----
  { slug: "silka", name: "Silka", origin: "Philippines" },
  { slug: "belo", name: "Belo Essentials", origin: "Philippines" },
  { slug: "cream-silk", name: "Cream Silk", origin: "Philippines" },
  { slug: "human-nature", name: "Human Nature", origin: "Philippines" },
  { slug: "ever-bilena", name: "Ever Bilena", origin: "Philippines" },
  { slug: "tiny-buds", name: "Tiny Buds", origin: "Philippines" },
  { slug: "pinoy-pantry", name: "Pinoy Pantry", origin: "Philippines" },
];

export const brandMap = new Map(brands.map((b) => [b.slug, b]));
export const getBrandName = (slug: string) => brandMap.get(slug)?.name ?? slug;
