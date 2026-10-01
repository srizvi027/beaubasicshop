"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { CategorySlug, Product, ProductFilterState } from "@/lib/types";
import { activeFilterCount, applyFilters, emptyFilters, filtersFromParams, filtersToParams, sortOptions } from "@/lib/filters";
import { useScrollLock } from "@/components/store/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters, type FilterFacets } from "./ProductFilters";

export function ShopView({ products, showCategories = true, query }: { products: Product[]; showCategories?: boolean; query?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  useScrollLock(sheetOpen);

  const state = useMemo(() => filtersFromParams(new URLSearchParams(params.toString())), [params]);
  const results = useMemo(() => applyFilters(products, state), [products, state]);
  const facets = useMemo<FilterFacets>(() => {
    const cats = new Map<CategorySlug, number>();
    const brands = new Map<string, number>();
    products.forEach((p) => {
      cats.set(p.category, (cats.get(p.category) ?? 0) + 1);
      brands.set(p.brand, (brands.get(p.brand) ?? 0) + 1);
    });
    return {
      categories: [...cats].map(([slug, count]) => ({ slug, count })),
      brands: [...brands].map(([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count),
    };
  }, [products]);

  const update = (next: ProductFilterState) => {
    const qs = filtersToParams(next);
    const keep = new URLSearchParams();
    if (query) keep.set("q", query);
    const sub = params.get("sub");
    if (sub) keep.set("sub", sub);
    const q = keep.toString();
    const full = [q, qs].filter(Boolean).join("&");
    startTransition(() => router.replace(`${pathname}${full ? `?${full}` : ""}`, { scroll: false }));
  };
  const count = activeFilterCount(state);

  const onSheetDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) setSheetOpen(false);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr] xl:gap-16">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-32">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Filter</h2>
            {count > 0 && <button onClick={() => update({ ...emptyFilters, sort: state.sort })} className="text-xs text-black/55 underline underline-offset-4 hover:text-ink">Clear all ({count})</button>}
          </div>
          <ProductFilters state={state} onChange={update} facets={facets} showCategories={showCategories} />
        </div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-black/10 pb-4">
          <p className="text-sm text-black/60" aria-live="polite"><span className="font-semibold text-ink tabular-nums">{results.length}</span> {results.length === 1 ? "product" : "products"}</p>
          <button onClick={() => setSheetOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 px-5 text-sm font-medium lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filter & sort {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-blue px-1 text-[0.65rem] text-white">{count}</span>}
          </button>
          <label className="relative hidden items-center gap-2 text-sm lg:flex">
            <span className="text-black/55">Sort by</span>
            <select
              value={state.sort}
              onChange={(e) => update({ ...state, sort: e.target.value as ProductFilterState["sort"] })}
              className="h-10 appearance-none rounded-full border border-black/15 bg-white pl-4 pr-9 text-sm font-medium focus:border-ink focus:outline-none"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4" />
          </label>
        </div>

        {results.length ? (
          <motion.ul layout className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 md:gap-y-14">
            <AnimatePresence mode="popLayout">
              {results.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={p} priority={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="flex flex-col items-start gap-4 bg-mist p-10">
            <p className="editorial text-3xl">Nothing matches those filters.</p>
            <p className="text-sm text-black/60">Remove a filter or two to see more products.</p>
            <button onClick={() => update({ ...emptyFilters, sort: state.sort })} className="h-11 rounded-full bg-ink px-6 text-sm font-semibold text-white">Clear filters</button>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div className="absolute inset-0 bg-plum/45" onClick={() => setSheetOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filter and sort"
              className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] bg-white"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={onSheetDragEnd}
            >
              <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-black/15" aria-hidden />
              <div className="flex items-center justify-between px-6 pb-2 pt-4">
                <h2 className="display text-3xl">Filter & sort</h2>
                <button onClick={() => setSheetOpen(false)} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-full bg-mist"><X className="h-4 w-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6" onPointerDownCapture={(e) => e.stopPropagation()}>
                <fieldset className="border-b border-black/10 py-6">
                  <legend className="mb-4 text-sm font-semibold">Sort by</legend>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((o) => (
                      <button key={o.value} aria-pressed={state.sort === o.value} onClick={() => update({ ...state, sort: o.value })} className={`rounded-full border px-4 py-2 text-sm ${state.sort === o.value ? "border-ink bg-ink text-white" : "border-black/15"}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <div className="pt-6">
                  <ProductFilters state={state} onChange={update} facets={facets} showCategories={showCategories} />
                </div>
              </div>
              <div className="flex gap-3 border-t border-black/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button onClick={() => update({ ...emptyFilters, sort: state.sort })} className="h-13 flex-1 rounded-full border border-black/15 text-sm font-semibold">Clear</button>
                <button onClick={() => setSheetOpen(false)} className="h-13 flex-[2] rounded-full bg-blue text-sm font-semibold text-white">Show {results.length} products</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
