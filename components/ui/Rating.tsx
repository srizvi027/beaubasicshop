import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function Rating({ rating, className }: { rating?: { average: number; count: number }; className?: string }) {
  if (!rating) return <p className={cn("text-xs text-black/50", className)}>No reviews yet</p>;
  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <div className="flex" aria-label={`Rated ${rating.average} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, rating.average - i));
          return (
            <span key={i} className="relative h-3.5 w-3.5">
              <Star className="absolute h-3.5 w-3.5 text-black/20" strokeWidth={1.5} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="h-3.5 w-3.5 fill-ink text-ink" strokeWidth={1.5} />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-black/60">
        {rating.average.toFixed(1)} ({rating.count})
      </span>
    </div>
  );
}
