import { Cake, Heart, Sparkles } from "lucide-react";
import { loyalty } from "@/data/site";
import { Counter } from "@/components/animations/Counter";
import { MaskText } from "@/components/animations/MaskText";
import { Reveal, StaggerChildren, StaggerItem } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";

const icons = { sparkles: Sparkles, cake: Cake, heart: Heart } as const;

export function Loyalty() {
  return (
    <section aria-label="Beau Points loyalty program" className="bg-cobalt text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <MaskText lines={["Shop, earn,", "get spoiled."]} className="display text-[clamp(3.2rem,8vw,8.6rem)]" />
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="editorial text-2xl leading-snug text-white/90">{loyalty.name}: {loyalty.earnRate}, plus easy bonus points.</p>
            <p className="mt-3 text-white/70">{loyalty.redeem}</p>
          </Reveal>
        </div>

        {/* Earn */}
        <div className="mt-16 grid gap-px overflow-hidden bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-cobalt p-8">
            <p className="display text-[5.5rem]"><Counter to={1} /><span className="text-3xl"> pt</span></p>
            <p className="mt-2 text-white/80">For every $1 you spend</p>
          </div>
          {loyalty.ways.map((w) => {
            const Icon = icons[w.icon as keyof typeof icons];
            return (
              <div key={w.label} className="bg-cobalt p-8">
                <p className="display flex items-start gap-3 text-[5.5rem]">
                  <Counter to={w.points} />
                  <Icon className="mt-3 h-6 w-6 text-pink" />
                </p>
                <p className="mt-2 text-white/80">{w.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tiers — a genuine progression, so they're shown in order */}
        <StaggerChildren className="mt-16 grid gap-4 md:grid-cols-3">
          {loyalty.tiers.map((t, i) => (
            <StaggerItem key={t.name}>
              <article className={`flex h-full flex-col p-8 transition-transform duration-500 hover:-translate-y-1.5 ${i === 2 ? "bg-pink text-white" : i === 1 ? "bg-blush text-plum" : "bg-white text-plum"}`}>
                <p className="text-sm opacity-70">{t.threshold === 0 ? "When you join" : `From ${t.threshold.toLocaleString()} points`}</p>
                <h3 className="mt-2 font-serif text-5xl tracking-[-0.02em]">{t.name}</h3>
                <ul className="mt-8 space-y-3 border-t border-current/15 pt-6 text-[0.95rem]">
                  {t.perks.map((p) => <li key={p} className="flex gap-3"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />{p}</li>)}
                </ul>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
        <Reveal className="mt-12">
          <ButtonLink href="/loyalty" variant="light">Join Beau Points</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
