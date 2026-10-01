import type { Product } from "@/lib/types";
import { StaggerChildren, StaggerItem } from "@/components/animations/Reveal";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/cn";

export function ProductGrid({
  products, columns = 4, tone, className, priorityCount = 0,
}: { products: Product[]; columns?: 3 | 4; tone?: "mist" | "white" | "blush"; className?: string; priorityCount?: number }) {
  return (
    <StaggerChildren
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-y-14",
        columns === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3",
        className,
      )}
    >
      {products.map((p, i) => (
        <StaggerItem key={p.id}>
          <ProductCard product={p} tone={tone} priority={i < priorityCount} />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
