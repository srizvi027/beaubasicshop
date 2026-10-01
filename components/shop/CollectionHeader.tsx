import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskText } from "@/components/animations/MaskText";
import { Reveal } from "@/components/animations/Reveal";

export function CollectionHeader({ title, description, crumbs, tone = "#FFFFFE" }: { title: string; description?: string; crumbs: { name: string; href: string }[]; tone?: string }) {
  const dark = tone === "#281A39";
  return (
    <header style={{ background: tone }} className={dark ? "text-cream [&_nav]:text-cream/60 [&_[aria-current]]:text-cream" : ""}>
      <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-8 md:px-10 md:pb-16 md:pt-10">
        <Breadcrumbs items={crumbs} />
        <MaskText as="h1" lines={[title]} play className="display mt-8 text-[clamp(3.4rem,10vw,10rem)]" />
        {description && (
          <Reveal delay={0.2}>
            <p className="editorial mt-4 max-w-[48ch] text-xl md:text-2xl">{description}</p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
