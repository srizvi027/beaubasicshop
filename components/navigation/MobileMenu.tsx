"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { announcements, site } from "@/data/site";
import { useCart } from "@/components/store/cart";
import { useScrollLock, useUI } from "@/components/store/ui";
import { LogoMark } from "@/components/ui/LogoMark";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.18 + i * 0.045, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

export function MobileMenu() {
  const { menuOpen, setMenuOpen, setSearchOpen } = useUI();
  const { count, open: openCart } = useCart();
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  useScrollLock(menuOpen);
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  const close = () => setMenuOpen(false);
  const links = [
    { label: "Best Sellers", href: "/collections/best-sellers" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Sale", href: "/collections/sale" },
  ];

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-blush xl:hidden"
          initial={{ clipPath: "circle(0% at 32px 56px)" }}
          animate={{ clipPath: "circle(150% at 32px 56px)" }}
          exit={{ clipPath: "circle(0% at 32px 56px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-4">
            <motion.button
              onClick={close}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white"
              initial={{ rotate: -90, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.5 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
            <LogoMark className="h-10 w-auto text-pink" />
            <div className="flex">
              <button onClick={() => { close(); setSearchOpen(true); }} aria-label="Search" className="grid h-11 w-11 place-items-center"><Search className="h-5 w-5" strokeWidth={1.6} /></button>
              <button onClick={() => { close(); openCart(); }} aria-label={`Cart (${count})`} className="relative grid h-11 w-11 place-items-center">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
                {count > 0 && <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-blue px-1 text-[0.62rem] font-bold text-white">{count}</span>}
              </button>
            </div>
          </div>

          <nav aria-label="Mobile" className="flex-1 px-6 pt-6">
            <ul className="flex flex-col">
              <motion.li custom={0} variants={item} initial="hidden" animate="show" className="border-b border-plum/15">
                <Link href="/shop" className="display block py-3 text-[2.9rem]">Shop all</Link>
              </motion.li>
              {categories.map((c, i) => {
                const open = expanded === c.slug;
                return (
                  <motion.li key={c.slug} custom={i + 1} variants={item} initial="hidden" animate="show" className="border-b border-plum/15">
                    <div className="flex items-center justify-between">
                      <Link href={`/collections/${c.slug}`} className="display block py-3 text-[2.9rem]">{c.name}</Link>
                      <button onClick={() => setExpanded(open ? null : c.slug)} aria-expanded={open} aria-label={`${open ? "Collapse" : "Expand"} ${c.name}`} className="grid h-11 w-11 place-items-center">
                        <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown className="h-5 w-5" /></motion.span>
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden">
                          {c.subcategories.map((s) => (
                            <li key={s}><Link href={`/collections/${c.slug}?sub=${encodeURIComponent(s)}`} className="block py-2 pl-1 text-base">{s}</Link></li>
                          ))}
                          <li className="pb-4" />
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
              {links.map((l, i) => (
                <motion.li key={l.href} custom={categories.length + 1 + i} variants={item} initial="hidden" animate="show" className="border-b border-plum/15">
                  <Link href={l.href} className={`display block py-3 text-[2.9rem] ${l.label === "Sale" ? "text-pink" : ""}`}>{l.label}</Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div className="mt-10 grid grid-cols-2 gap-3 px-6" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }}>
            <Link href="/pages/contact" className="flex h-13 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold"><User className="h-4 w-4" /> Account</Link>
            <Link href="/wishlist" className="flex h-13 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold"><Heart className="h-4 w-4" /> Wishlist</Link>
          </motion.div>
          <motion.p className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-sm text-plum/70" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.7 } }}>
            {announcements[0].text}{announcements[0].code && <> with code <strong className="text-plum">{announcements[0].code}</strong></>}. Shipping Australia-wide from {site.location.town}, {site.location.state}.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
