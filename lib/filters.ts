import type { Product, ProductFilterState, SortKey } from "@/lib/types";
import { getPricing } from "@/lib/pricing";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "best-selling", label: "Best selling" },
];

export const emptyFilters: ProductFilterState = {
  categories: [],
  brands: [],
  price: null,
  inStockOnly: false,
  onSale: false,
  newArrivals: false,
  bestsellers: false,
  sort: "featured",
};

/**
 * Pure filter + sort. Runs on the client for the demo catalogue; for very large
 * catalogues call the same logic server-side (or translate to your backend's query).
 */
export function applyFilters(products: Product[], f: ProductFilterState): Product[] {
  let list = products.filter((p) => {
    const price = getPricing(p).current;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.price && (price < f.price[0] || price > f.price[1])) return false;
    if (f.inStockOnly && p.stock === "out_of_stock") return false;
    if (f.onSale && !getPricing(p).onSale) return false;
    if (f.newArrivals && !p.newArrival) return false;
    if (f.bestsellers && !p.bestseller) return false;
    return true;
  });

  const price = (p: Product) => getPricing(p).current;
  switch (f.sort) {
    case "newest": list = list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    case "price-asc": list = list.sort((a, b) => price(a) - price(b)); break;
    case "price-desc": list = list.sort((a, b) => price(b) - price(a)); break;
    case "best-selling": list = list.sort((a, b) => (a.salesRank ?? 999) - (b.salesRank ?? 999)); break;
    default:
      list = list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || (a.salesRank ?? 999) - (b.salesRank ?? 999));
  }
  // Out of stock always last
  return list.sort((a, b) => Number(a.stock === "out_of_stock") - Number(b.stock === "out_of_stock"));
}

export function activeFilterCount(f: ProductFilterState) {
  return f.categories.length + f.brands.length + (f.price ? 1 : 0) + [f.inStockOnly, f.onSale, f.newArrivals, f.bestsellers].filter(Boolean).length;
}

/** URL <-> filter state, so filtered views are shareable and survive refresh. */
export function filtersFromParams(params: URLSearchParams): ProductFilterState {
  const list = (k: string) => (params.get(k)?.split(",").filter(Boolean) ?? []);
  const price = params.get("price")?.split("-").map(Number);
  return {
    categories: list("category") as ProductFilterState["categories"],
    brands: list("brand"),
    price: price && price.length === 2 && price.every((n) => !Number.isNaN(n)) ? [price[0], price[1]] : null,
    inStockOnly: params.get("instock") === "1",
    onSale: params.get("sale") === "1",
    newArrivals: params.get("new") === "1",
    bestsellers: params.get("best") === "1",
    sort: (sortOptions.find((s) => s.value === params.get("sort"))?.value ?? "featured") as SortKey,
  };
}

export function filtersToParams(f: ProductFilterState): string {
  const p = new URLSearchParams();
  if (f.categories.length) p.set("category", f.categories.join(","));
  if (f.brands.length) p.set("brand", f.brands.join(","));
  if (f.price) p.set("price", `${f.price[0]}-${f.price[1]}`);
  if (f.inStockOnly) p.set("instock", "1");
  if (f.onSale) p.set("sale", "1");
  if (f.newArrivals) p.set("new", "1");
  if (f.bestsellers) p.set("best", "1");
  if (f.sort !== "featured") p.set("sort", f.sort);
  return p.toString();
}
