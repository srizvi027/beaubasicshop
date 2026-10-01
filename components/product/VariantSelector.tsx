"use client";

import type { Product, ProductVariant } from "@/lib/types";
import { cn } from "@/lib/cn";

export function VariantSelector({ product, value, onChange }: { product: Product; value?: ProductVariant; onChange: (v: ProductVariant) => void }) {
  if (!product.variants?.length) return null;
  const label = product.variantLabel ?? "Option";
  return (
    <fieldset>
      <legend className="mb-3 text-sm">
        <span className="font-semibold">{label}:</span> <span className="text-black/65">{value?.name}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {product.variants.map((v) => {
          const selected = v.id === value?.id;
          const soldOut = v.stock === "out_of_stock";
          return v.swatch ? (
            <button
              key={v.id}
              type="button"
              aria-pressed={selected}
              aria-label={`${v.name}${soldOut ? " (sold out)" : ""}`}
              title={v.name}
              disabled={soldOut}
              onClick={() => onChange(v)}
              className={cn("relative h-10 w-10 rounded-full ring-offset-2 transition", selected ? "ring-2 ring-ink" : "ring-1 ring-black/10 hover:ring-black/40", soldOut && "opacity-40")}
              style={{ background: v.swatch }}
            >
              {soldOut && <span className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -rotate-45 bg-white" />}
            </button>
          ) : (
            <button
              key={v.id}
              type="button"
              aria-pressed={selected}
              disabled={soldOut}
              onClick={() => onChange(v)}
              className={cn("h-11 rounded-full border px-5 text-sm transition", selected ? "border-ink bg-ink text-white" : "border-black/15 hover:border-ink", soldOut && "line-through opacity-40")}
            >
              {v.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
