import { categories, categoryMap } from "@/data/categories";
import { getBrandName } from "@/data/brands";
import type { CategorySlug, Collection, CollectionSlug, Product } from "@/lib/types";
import { getPricing } from "@/lib/pricing";
import { localSource } from "./local-source";
import type { CatalogSource } from "./source";

/* ──────────────────────────────────────────────────────────────
 * Swap this line to change where products come from.
 * e.g. `const source: CatalogSource = shopifySource;`
 * ────────────────────────────────────────────────────────────── */
const source: CatalogSource = localSource;

export async function getAllProducts(): Promise<Product[]> {
  return source.listProducts();
}

export async function getProductBySlug(slug: string) {
  return source.getProductBySlug(slug);
}

export async function getProductsByCategory(category: CategorySlug, limit?: number) {
  const all = await getAllProducts();
  return take(all.filter((p) => p.category === category).sort(byRank), limit);
}

export async function getBestSellers(limit?: number) {
  const all = await getAllProducts();
  return take(all.filter((p) => p.bestseller).sort(byRank), limit);
}

export async function getNewArrivals(limit?: number) {
  const all = await getAllProducts();
  return take(all.filter((p) => p.newArrival).sort(byNewest), limit);
}

export async function getSaleProducts(limit?: number) {
  const all = await getAllProducts();
  return take(all.filter((p) => getPricing(p).onSale).sort(byRank), limit);
}

export async function getFeaturedProducts(limit?: number) {
  const all = await getAllProducts();
  return take(all.filter((p) => p.featured).sort(byRank), limit);
}

/** Same category first, then shared tags, then same brand. */
export async function getRelatedProducts(product: Product, limit = 4) {
  const all = await getAllProducts();
  const scored = all
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.category === product.category) score += 3;
      if (p.subcategory && p.subcategory === product.subcategory) score += 2;
      if (p.brand === product.brand) score += 1;
      score += p.tags.filter((t) => product.tags.includes(t)).length;
      return { p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || byRank(a.p, b.p));
  return scored.slice(0, limit).map((s) => s.p);
}

/** Weighted text search across name, brand, category, tags and description. */
export async function searchProducts(query: string, limit = 8): Promise<Product[]> {
  const q = normalise(query);
  if (!q) return [];
  if (source.search) return source.search(q, limit);
  const terms = q.split(" ").filter(Boolean);
  const all = await getAllProducts();
  return all
    .map((p) => {
      const fields = {
        name: normalise(p.name),
        brand: normalise(getBrandName(p.brand)),
        category: normalise(categoryMap.get(p.category)?.name ?? ""),
        tags: normalise(p.tags.join(" ")),
        body: normalise(`${p.subcategory ?? ""} ${p.shortDescription}`),
      };
      let score = 0;
      for (const t of terms) {
        let hit = false;
        if (fields.name.includes(t)) { score += fields.name.startsWith(t) ? 6 : 4; hit = true; }
        if (fields.brand.includes(t)) { score += 4; hit = true; }
        if (fields.tags.includes(t)) { score += 3; hit = true; }
        if (fields.category.includes(t)) { score += 2; hit = true; }
        if (fields.body.includes(t)) { score += 1; hit = true; }
        if (!hit) return { p, score: 0 };
      }
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || byRank(a.p, b.p))
    .slice(0, limit)
    .map((r) => r.p);
}

/* ─────────────── Collections ─────────────── */

const virtualCollections: Collection[] = [
  { slug: "all", title: "Shop all", description: "Everything we stock, from Manila to your mailbox." },
  { slug: "best-sellers", title: "Best Sellers", description: "The products everyone is reaching for." },
  { slug: "new-arrivals", title: "New Arrivals", description: "Fresh from our latest shipment." },
  { slug: "sale", title: "Sale", description: "Beauty favourites at softer prices, while stock lasts." },
];

export function getCollections(): Collection[] {
  return [
    ...virtualCollections,
    ...categories.map((c) => ({ slug: c.slug, title: c.name, description: c.description })),
  ];
}

export function getCollection(slug: string): Collection | undefined {
  return getCollections().find((c) => c.slug === slug);
}

export async function getCollectionProducts(slug: CollectionSlug): Promise<Product[]> {
  switch (slug) {
    case "all": return (await getAllProducts()).slice().sort(byRank);
    case "best-sellers": return getBestSellers();
    case "new-arrivals": return getNewArrivals();
    case "sale": return getSaleProducts();
    default: return getProductsByCategory(slug);
  }
}

/** Data for desktop mega menus — kept small so the header stays light. */
export async function getMegaMenuData() {
  const all = await getAllProducts();
  const pick = (list: Product[]) => list.sort(byRank).slice(0, 2);
  const byCategory = Object.fromEntries(
    categories.map((c) => {
      const inCat = all.filter((p) => p.category === c.slug);
      return [
        c.slug,
        {
          featured: pick(inCat.filter((p) => p.featured).concat(inCat.filter((p) => !p.featured))).slice(0, 2),
          brands: Array.from(new Set(inCat.map((p) => p.brand))).map((b) => ({ slug: b, name: getBrandName(b) })),
        },
      ];
    }),
  );
  const shop = {
    featured: pick(all.filter((p) => p.featured)),
    brands: Array.from(new Set(all.map((p) => p.brand))).slice(0, 8).map((b) => ({ slug: b, name: getBrandName(b) })),
  };
  return { shop, byCategory };
}
export type MegaMenuData = Awaited<ReturnType<typeof getMegaMenuData>>;

/* ─────────────── utils ─────────────── */
function byRank(a: Product, b: Product) {
  return (a.salesRank ?? 999) - (b.salesRank ?? 999);
}
function byNewest(a: Product, b: Product) {
  return b.createdAt.localeCompare(a.createdAt);
}
function take<T>(list: T[], limit?: number) {
  return limit ? list.slice(0, limit) : list;
}
function normalise(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}
