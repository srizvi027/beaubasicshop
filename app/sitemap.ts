import type { MetadataRoute } from "next";
import { getAllProducts, getCollections } from "@/lib/catalog";
import { infoPages } from "@/data/pages";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  return [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/shop"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/about"), priority: 0.5 },
    { url: absoluteUrl("/loyalty"), priority: 0.5 },
    ...getCollections().map((c) => ({ url: absoluteUrl(`/collections/${c.slug}`), changeFrequency: "daily" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...infoPages.map((p) => ({ url: absoluteUrl(`/pages/${p.slug}`), priority: 0.3 })),
  ];
}
