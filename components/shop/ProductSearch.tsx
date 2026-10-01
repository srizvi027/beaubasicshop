"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock, CornerDownLeft, Search, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { useScrollLock, useUI } from "@/components/store/ui";
import { categories } from "@/data/categories";
import { popularSearches } from "@/data/site";
import { getBrandName } from "@/data/brands";
import { formatPrice, getPricing } from "@/lib/pricing";
import { ProductImage } from "@/components/product/ProductImage";
import { cn } from "@/lib/cn";

const RECENT_KEY = "bb-recent-searches";

/** Full-screen search overlay. Results come from /api/search, so it works with any backend. */
export function ProductSearch() {
  const { searchOpen, setSearchOpen } = useUI();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  useScrollLock(searchOpen);

  useEffect(() => {
    if (!searchOpen) return;
    try { setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]")); } catch {}
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [searchOpen]);

  // Debounced fetch
  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const ctrl = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`, { signal: ctrl.signal });
        const data = await res.json();
        setResults(data.products ?? []);
        setActive(-1);
      } catch {}
      setLoading(false);
    }, 140);
    return () => { ctrl.abort(); window.clearTimeout(t); };
  }, [query]);

  const close = () => { setSearchOpen(false); setQuery(""); setResults([]); };

  const remember = (term: string) => {
    const next = [term, ...recent.filter((r) => r.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
  };

  const openProduct = (p: Product) => {
    if (query.trim()) remember(query.trim());
    close();
    router.push(`/products/${p.slug}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) openProduct(results[active]);
      else if (query.trim()) { remember(query.trim()); close(); router.push(`/shop?q=${encodeURIComponent(query.trim())}`); }
    }
  };

  const showSuggestions = !query.trim();

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="absolute inset-0 bg-plum/50" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="relative max-h-[100dvh] overflow-y-auto bg-white"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onKeyDown}
          >
            <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 md:px-10 md:pb-14 md:pt-10">
              <div className="flex items-center gap-4 border-b-2 border-ink pb-3">
                <Search className="h-6 w-6 shrink-0 md:h-8 md:w-8" strokeWidth={1.6} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search barley, sunscreen, ube…"
                  aria-label="Search products"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                  aria-activedescendant={active >= 0 ? `sr-${active}` : undefined}
                  className="display min-w-0 flex-1 bg-transparent text-[clamp(2rem,6vw,4.5rem)] placeholder:text-black/20 focus:outline-none"
                />
                <button onClick={close} aria-label="Close search" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mist transition hover:rotate-90 hover:bg-ink hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-3 hidden items-center gap-3 text-xs text-black/45 md:flex">
                <span className="inline-flex items-center gap-1"><kbd className="rounded border border-black/15 px-1.5">↑</kbd><kbd className="rounded border border-black/15 px-1.5">↓</kbd> to browse</span>
                <span className="inline-flex items-center gap-1"><kbd className="rounded border border-black/15 px-1.5"><CornerDownLeft className="inline h-3 w-3" /></kbd> to open</span>
                <span className="inline-flex items-center gap-1"><kbd className="rounded border border-black/15 px-1.5">esc</kbd> to close</span>
              </p>

              {showSuggestions ? (
                <div className="mt-10 grid gap-10 md:grid-cols-3">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-pink" /> Popular searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((s) => (
                        <button key={s} onClick={() => setQuery(s)} className="rounded-full border border-black/15 px-4 py-2 text-sm transition hover:border-ink hover:bg-ink hover:text-white">{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold"><Clock className="h-4 w-4 text-pink" /> Recent searches</h3>
                    {recent.length ? (
                      <ul className="space-y-2">
                        {recent.map((r) => (
                          <li key={r}><button onClick={() => setQuery(r)} className="link-underline text-sm">{r}</button></li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-black/50">Searches you make will show up here.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-4 text-sm font-semibold">Shop by category</h3>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {categories.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/collections/${c.slug}`} onClick={close} className="group inline-flex items-center gap-1 text-sm">
                            <span className="link-underline">{c.name}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <p className="mb-5 text-sm text-black/55" aria-live="polite">
                    {loading ? "Searching…" : results.length ? `${results.length} product${results.length > 1 ? "s" : ""} for “${query}”` : `No products match “${query}”. Try a brand, an ingredient or a category.`}
                  </p>
                  <ul id="search-results" role="listbox" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {results.map((p, i) => (
                      <motion.li
                        key={p.id}
                        id={`sr-${i}`}
                        role="option"
                        aria-selected={i === active}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.35 }}
                      >
                        <button
                          onClick={() => openProduct(p)}
                          onMouseEnter={() => setActive(i)}
                          className={cn("flex w-full items-center gap-4 p-2 text-left transition lg:flex-col lg:items-stretch lg:p-0", i === active ? "bg-mist lg:bg-transparent" : "")}
                        >
                          <span className={cn("relative block h-20 w-16 shrink-0 bg-mist transition lg:aspect-[4/5] lg:h-auto lg:w-full", i === active && "lg:ring-2 lg:ring-blue")}>
                            <ProductImage src={p.images[0].src} alt="" fill sizes="(min-width: 1024px) 20vw, 64px" className="p-2 lg:p-6" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-black/50">{getBrandName(p.brand)}</span>
                            <span className="block text-sm leading-snug">{p.name}</span>
                            <span className="block text-sm font-semibold tabular-nums">{formatPrice(getPricing(p).current)}</span>
                          </span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                  {results.length > 0 && (
                    <Link href={`/shop?q=${encodeURIComponent(query)}`} onClick={() => { remember(query.trim()); close(); }} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                      <span className="link-underline">See all results</span> <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
