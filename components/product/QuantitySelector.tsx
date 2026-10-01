"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function QuantitySelector({
  value, onChange, min = 1, max = 99, size = "md", label = "Quantity",
}: { value: number; onChange: (n: number) => void; min?: number; max?: number; size?: "sm" | "md"; label?: string }) {
  const h = size === "sm" ? "h-9" : "h-13";
  return (
    <div className={cn("inline-flex items-center rounded-full border border-black/15", h)} role="group" aria-label={label}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={cn("grid place-items-center rounded-full hover:bg-mist disabled:opacity-30", size === "sm" ? "h-9 w-9" : "h-13 w-12")}>
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={cn("grid place-items-center rounded-full hover:bg-mist disabled:opacity-30", size === "sm" ? "h-9 w-9" : "h-13 w-12")}>
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
