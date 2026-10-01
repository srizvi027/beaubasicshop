import { formatPrice, type Pricing } from "@/lib/pricing";
import { cn } from "@/lib/cn";

export function Price({ pricing, size = "md", className }: { pricing: Pricing; size?: "sm" | "md" | "lg"; className?: string }) {
  const sz = size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-[0.95rem]";
  return (
    <p className={cn("flex items-baseline gap-2 tabular-nums", sz, className)}>
      <span className={cn("font-semibold", pricing.onSale && "text-pink")}>
        <span className="sr-only">{pricing.onSale ? "Sale price " : "Price "}</span>
        {formatPrice(pricing.current)}
      </span>
      {pricing.original && (
        <span className="text-[0.85em] text-black/45 line-through">
          <span className="sr-only">Original price </span>
          {formatPrice(pricing.original)}
        </span>
      )}
    </p>
  );
}
