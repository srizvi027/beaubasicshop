"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MegaMenuData } from "@/lib/catalog";
import { mainNav } from "@/data/site";
import { useCart } from "@/components/store/cart";
import { useWishlist } from "@/components/store/wishlist";
import { useUI } from "@/components/store/ui";
import { Logo } from "@/components/ui/Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/cn";

export function Header({ megaData }: { megaData: MegaMenuData }) {
  const pathname = usePathname();
  const { count, pulse, open: openCart } = useCart();
  const { ids } = useWishlist();
  const { setSearchOpen, menuOpen, setMenuOpen } = useUI();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number>(undefined);
  const cartControls = useAnimationControls();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpenMenu(null), [pathname]);

  // Cart icon reacts whenever something is added
  useEffect(() => {
    if (!pulse) return;
    cartControls.start({ scale: [1, 1.35, 0.9, 1.08, 1], rotate: [0, -12, 10, -4, 0], transition: { duration: 0.7 } });
  }, [pulse, cartControls]);

  const enter = (i: number | null) => { window.clearTimeout(closeTimer.current); setOpenMenu(i); };
  const leave = () => { closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140); };
  const active = openMenu !== null ? mainNav[openMenu] : null;

  return (
    <>
      <header
        className={cn("sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-300", (scrolled || active) && "shadow-[0_1px_0_rgba(0,0,0,0.08)]")}
        onMouseLeave={leave}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[1600px] items-center gap-4 px-4 md:px-10">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="-ml-2 grid h-11 w-11 place-items-center xl:hidden">
            <Menu className="h-5 w-5" strokeWidth={1.6} />
          </button>

          <Logo className="max-xl:absolute max-xl:left-1/2 max-xl:-translate-x-1/2" />

          <nav aria-label="Main" className="mx-auto hidden xl:block">
            <ul className="flex items-center">
              {mainNav.map((item, i) => {
                const current = pathname === item.href || (item.href !== "/shop" && pathname.startsWith(item.href));
                return (
                  <li key={item.href} onMouseEnter={() => enter(item.mega ? i : null)}>
                    <Link
                      href={item.href}
                      aria-haspopup={item.mega ? "true" : undefined}
                      aria-expanded={item.mega ? openMenu === i : undefined}
                      onFocus={() => enter(item.mega ? i : null)}
                      className={cn(
                        "relative flex h-[4.5rem] items-center px-3 text-[0.74rem] font-semibold uppercase tracking-[0.09em] transition-colors 2xl:px-4",
                        item.label === "Sale" ? "text-pink" : "hover:text-blue",
                      )}
                    >
                      {item.label}
                      {(current || openMenu === i) && (
                        <motion.span layoutId="nav-underline" className="absolute inset-x-3 bottom-5 h-[2px] bg-current 2xl:inset-x-4" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center xl:ml-0">
            <IconButton label="Search (press /)" onClick={() => setSearchOpen(true)}><Search className="h-[19px] w-[19px]" strokeWidth={1.6} /></IconButton>
            <IconLink href="/pages/contact" label="Account" className="hidden sm:grid"><User className="h-[19px] w-[19px]" strokeWidth={1.6} /></IconLink>
            <IconLink href="/wishlist" label={`Wishlist (${ids.length})`} className="hidden sm:grid">
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.6} />
              {ids.length > 0 && <Dot n={ids.length} className="bg-pink" />}
            </IconLink>
            <IconButton label={`Cart (${count} items)`} onClick={openCart}>
              <motion.span animate={cartControls} className="relative inline-flex">
                <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.6} />
              </motion.span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 20 }}
                    className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-blue px-1 text-[0.62rem] font-bold tabular-nums text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </IconButton>
          </div>
        </div>

        <AnimatePresence>
          {active?.mega && (
            <div onMouseEnter={() => enter(openMenu)} className="hidden xl:block">
              <MegaMenu key={active.href} kind={active.mega} category={active.category} data={megaData} onNavigate={() => setOpenMenu(null)} />
            </div>
          )}
        </AnimatePresence>
      </header>

      {/* Dim the page while a mega menu is open */}
      <AnimatePresence>
        {active?.mega && (
          <motion.div className="fixed inset-0 z-30 hidden bg-plum/20 xl:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseEnter={() => setOpenMenu(null)} />
        )}
      </AnimatePresence>

      <MobileMenu />
    </>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-mist">
      {children}
    </button>
  );
}
function IconLink({ href, label, children, className }: { href: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} aria-label={label} title={label} className={cn("relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-mist", className)}>
      {children}
    </Link>
  );
}
function Dot({ n, className }: { n: number; className?: string }) {
  return <span className={cn("absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[0.62rem] font-bold tabular-nums text-white", className)}>{n}</span>;
}
