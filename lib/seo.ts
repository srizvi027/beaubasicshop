import type { Metadata } from "next";
import { site } from "@/data/site";
import { getBrandName } from "@/data/brands";
import { getPricing } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

export function buildMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const img = image ?? "/images/editorial/you-glow-babe.webp";
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: site.name, locale: site.locale, type: "website", images: [{ url: img }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export function productJsonLd(product: Product) {
  const pricing = getPricing(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.images.map((i) => absoluteUrl(i.src)),
    brand: { "@type": "Brand", name: getBrandName(product.brand) },
    category: product.category,
    ...(product.rating && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating.average, reviewCount: product.rating.count },
    }),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: site.currency,
      price: pricing.current.toFixed(2),
      availability:
        product.stock === "out_of_stock" ? "https://schema.org/OutOfStock"
        : product.stock === "preorder" ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/images/brand/mark.svg"),
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: site.location.town, addressRegion: site.location.state, postalCode: "6335", addressCountry: "AU" },
    sameAs: [site.instagramUrl, site.facebookUrl],
  };
}
