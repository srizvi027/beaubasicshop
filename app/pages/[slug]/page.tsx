import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInfoPage, infoPages } from "@/data/pages";
import { buildMetadata } from "@/lib/seo";
import { CollectionHeader } from "@/components/shop/CollectionHeader";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return infoPages.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getInfoPage((await params).slug);
  return page ? buildMetadata({ title: page.title, description: page.intro, path: `/pages/${page.slug}` }) : {};
}

export default async function InfoPage({ params }: Props) {
  const page = getInfoPage((await params).slug);
  if (!page) notFound();
  return (
    <>
      <CollectionHeader title={page.title} description={page.intro} tone="#EFEBE0" crumbs={[{ name: "Home", href: "/" }, { name: page.title, href: `/pages/${page.slug}` }]} />
      <article className="mx-auto max-w-[1600px] px-4 py-16 pb-28 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {page.sections.map((s) => (
            <section key={s.heading} className="lg:col-span-6 xl:col-span-4">
              <h2 className="text-sm font-semibold">{s.heading}</h2>
              <div className="mt-4 space-y-4 text-[1.02rem] leading-relaxed text-black/70">{s.body.map((b) => <p key={b}>{b}</p>)}</div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
