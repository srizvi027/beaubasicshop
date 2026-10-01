import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/LogoMark";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-[1600px] flex-col items-start gap-6 px-4 py-28 md:px-10">
      <LogoMark className="h-20 w-auto text-pink" />
      <h1 className="display text-[clamp(3.4rem,10vw,9rem)]">Page not found</h1>
      <p className="editorial max-w-[40ch] text-2xl">This page may have moved, or the product is no longer stocked.</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/shop">Shop all</ButtonLink>
        <ButtonLink href="/" variant="outline">Back home</ButtonLink>
      </div>
    </section>
  );
}
