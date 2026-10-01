"use client";

import { Check } from "lucide-react";
import type { CategorySlug, ProductFilterState } from "@/lib/types";
import { categoryMap } from "@/data/categories";
import { getBrandName } from "@/data/brands";
import { cn } from "@/lib/cn";

export const priceRanges: { label: string; value: [number, number] }[] = [
  { label: "Under $10", value: [0, 9.99] },
  { label: "$10 – $20", value: [10, 20] },
  { label: "$20 – $40", value: [20.01, 40] },
  { label: "$40+", value: [40.01, 10000] },
];

export interface FilterFacets {
  categories: { slug: CategorySlug; count: number }[];
  brands: { slug: string; count: number }[];
}

export function ProductFilters({
  state, onChange, facets, showCategories = true,
}: { state: ProductFilterState; onChange: (s: ProductFilterState) => void; facets: FilterFacets; showCategories?: boolean }) {
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="flex flex-col divide-y divide-black/10">
      <Group title="Show only">
        <Toggle label="On sale" checked={state.onSale} onChange={() => onChange({ ...state, onSale: !state.onSale })} />
        <Toggle label="New arrivals" checked={state.newArrivals} onChange={() => onChange({ ...state, newArrivals: !state.newArrivals })} />
        <Toggle label="Best sellers" checked={state.bestsellers} onChange={() => onChange({ ...state, bestsellers: !state.bestsellers })} />
        <Toggle label="In stock" checked={state.inStockOnly} onChange={() => onChange({ ...state, inStockOnly: !state.inStockOnly })} />
      </Group>

      {showCategories && facets.categories.length > 1 && (
        <Group title="Category">
          {facets.categories.map((c) => (
            <Check_ key={c.slug} label={categoryMap.get(c.slug)?.name ?? c.slug} count={c.count} checked={state.categories.includes(c.slug)} onChange={() => onChange({ ...state, categories: toggle(state.categories, c.slug) })} />
          ))}
        </Group>
      )}

      {facets.brands.length > 1 && (
        <Group title="Brand">
          {facets.brands.map((b) => (
            <Check_ key={b.slug} label={getBrandName(b.slug)} count={b.count} checked={state.brands.includes(b.slug)} onChange={() => onChange({ ...state, brands: toggle(state.brands, b.slug) })} />
          ))}
        </Group>
      )}

      <Group title="Price">
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((r) => {
            const active = state.price?.[0] === r.value[0] && state.price?.[1] === r.value[1];
            return (
              <button
                key={r.label}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...state, price: active ? null : r.value })}
                className={cn("rounded-full border px-4 py-2 text-sm transition", active ? "border-ink bg-ink text-white" : "border-black/15 hover:border-ink")}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="py-6 first:pt-0">
      <legend className="float-left mb-4 w-full text-sm font-semibold">{title}</legend>
      <div className="clear-both flex flex-col gap-2.5">{children}</div>
    </fieldset>
  );
}

function Check_({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className={cn("grid h-[18px] w-[18px] place-items-center border transition peer-focus-visible:ring-2 peer-focus-visible:ring-blue", checked ? "border-ink bg-ink text-white" : "border-black/30 group-hover:border-ink")}>
        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-black/40">{count}</span>}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm">
      {label}
      <input type="checkbox" role="switch" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className={cn("relative h-5 w-9 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue", checked ? "bg-blue" : "bg-black/15")}>
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
      </span>
    </label>
  );
}
