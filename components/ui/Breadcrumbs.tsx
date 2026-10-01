import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-black/55">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-1.5">
            {i < items.length - 1 ? (
              <>
                <Link href={it.href} className="link-underline hover:text-ink">{it.name}</Link>
                <span aria-hidden>/</span>
              </>
            ) : (
              <span aria-current="page" className="text-ink">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(items)) }} />
    </nav>
  );
}
