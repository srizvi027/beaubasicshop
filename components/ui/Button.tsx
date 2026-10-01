import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "light" | "outline" | "pink";

const styles: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-cobalt",
  dark: "bg-ink text-white hover:bg-plum",
  light: "bg-white text-ink hover:bg-blush",
  outline: "border border-current text-current hover:bg-ink hover:text-white hover:border-ink",
  pink: "bg-pink text-white hover:bg-ink",
};

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 rounded-full px-7 h-13 text-[0.8rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 disabled:opacity-40";

function Arrow() {
  return (
    <span className="relative -mr-1 inline-flex h-4 w-4 overflow-hidden" aria-hidden>
      <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-luxe)] group-hover/btn:translate-x-full" />
      <ArrowRight className="absolute h-4 w-4 -translate-x-full transition-transform duration-500 ease-[var(--ease-luxe)] group-hover/btn:translate-x-0" />
    </span>
  );
}

export function ButtonLink({
  href, children, variant = "primary", arrow = true, className,
}: { href: string; children: React.ReactNode; variant?: Variant; arrow?: boolean; className?: string }) {
  return (
    <Link href={href} className={cn(base, styles[variant], className)}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  children, variant = "primary", arrow = false, className, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; arrow?: boolean }) {
  return (
    <button className={cn(base, styles[variant], className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
