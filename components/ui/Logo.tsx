import Link from "next/link";
import { LogoMark } from "./LogoMark";
import { cn } from "@/lib/cn";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Beau & Basic Shop — home" className={cn("group inline-flex items-center gap-2", className)}>
      <LogoMark className="h-9 w-auto text-pink transition-transform duration-700 ease-[var(--ease-luxe)] group-hover:-rotate-6" />
      <span className="font-serif text-[1.45rem] leading-none tracking-[-0.02em]">
        Beau<span className="text-pink">&amp;</span>Basic
      </span>
    </Link>
  );
}
