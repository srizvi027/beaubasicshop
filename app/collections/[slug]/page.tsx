import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { X } from "lucide-react";
import { getCollection, getCollectionProducts, getCollections } from "@/lib/catalog";
import { categoryMap } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import type { CategorySlug, CollectionSlug } from "@/lib/types";
import { ShopView } from "@/components/shop/ShopView";
import { CollectionHeader } from "@/components/shop/CollectionHeader";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ sub?: string }> };

export function generateStaticParams() {
  return getCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return buildMetadata({ title: c.title, description: c.description, path: `/collections/${c.slug}`, image: categoryMap.get(slug as CategorySlug)?.image.src });
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sub } = await searchParams;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const category = categoryMap.get(slug as CategorySlug);
  let products = await getCollectionProducts(slug as CollectionSlug);
  if (sub) products = products.filter((p) => p.subcategory === sub);

  return (
    <>
      <CollectionHeader
        title={collection.title}
        description={collection.description}
        tone={category?.tone === "#281A39" ? "#281A39" : category?.tone ?? (slug === "sale" ? "#FFE4EC" : "#FFFFFE")}
        crumbs={[{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }, { name: collection.title, href: `/collections/${slug}` }]}
      />
      <div className="mx-auto max-w-[1600px] px-4 pb-28 pt-10 md:px-10">
        {category && (
          <nav aria-label={`${category.name} types`} className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4">
            <Link href={`/collections/${slug}`} className={`shrink-0 rounded-full border px-5 py-2.5 text-sm ${!sub ? "border-ink bg-ink text-white" : "border-black/15 hover:border-ink"}`}>All {category.name}</Link>
            {category.subcategories.map((s) => (
              <Link key={s} href={sub === s ? `/collections/${slug}` : `/collections/${slug}?sub=${encodeURIComponent(s)}`} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm ${sub === s ? "border-ink bg-ink text-white" : "border-black/15 hover:border-ink"}`}>
                {s}{sub === s && <X className="h-3.5 w-3.5" />}
              </Link>
            ))}
          </nav>
        )}
        <Suspense>
          <ShopView products={products} showCategories={!category} />
        </Suspense>
      </div>
    </>
  );
}
