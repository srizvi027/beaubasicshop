import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/catalog";
import { categoryMap } from "@/data/categories";
import { getBrandName } from "@/data/brands";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetails } from "@/components/product/ProductDetails";
import { RelatedProducts } from "@/components/product/RelatedProducts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.seo?.title ?? `${getBrandName(p.brand)} ${p.name}`,
    description: p.seo?.description ?? p.shortDescription,
    path: `/products/${p.slug}`,
    image: p.images[0].src.endsWith(".svg") ? undefined : p.images[0].src,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const category = categoryMap.get(product.category);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
      <div className="mx-auto max-w-[1600px] px-4 pt-6 md:px-10">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            ...(category ? [{ name: category.name, href: `/collections/${category.slug}` }] : []),
            { name: product.name, href: `/products/${product.slug}` },
          ]}
        />
      </div>
      <section className="mx-auto grid max-w-[1600px] gap-10 px-4 pb-10 pt-6 md:px-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-28">
            <ProductGallery images={product.images} name={product.name} />
          </div>
        </div>
        <div className="lg:col-span-5 lg:pt-4">
          <ProductDetails product={product} />
        </div>
      </section>
      <RelatedProducts product={product} />
    </>
  );
}
