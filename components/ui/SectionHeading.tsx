import { MaskText } from "@/components/animations/MaskText";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  title, lines, subtitle, action, className, tone = "dark",
}: { title?: string; lines?: string[]; subtitle?: string; action?: React.ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <MaskText lines={lines ?? [title ?? ""]} className="display text-[clamp(2.6rem,7vw,6rem)]" />
        {subtitle && (
          <Reveal delay={0.2}>
            <p className={cn("editorial mt-4 text-xl md:text-2xl", tone === "light" ? "text-white/75" : "text-black/65")}>{subtitle}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.25}>{action}</Reveal>}
    </div>
  );
}
