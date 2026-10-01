"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { announcements } from "@/data/site";

/** Rotating promo strip. Edit messages in data/site.ts. Pauses on hover. */
export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || announcements.length < 2) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % announcements.length), 4500);
    return () => window.clearInterval(t);
  }, [paused]);

  const a = announcements[i];

  return (
    <div
      className="relative z-50 h-9 overflow-hidden bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Promotions"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          initial={{ y: reduce ? 0 : "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center gap-2 px-3 text-center text-[0.6rem] font-medium uppercase tracking-[0.06em] sm:gap-3 sm:text-[0.7rem] sm:tracking-[0.12em]"
        >
          {a.href ? <Link href={a.href} className="link-underline">{a.text}</Link> : <span>{a.text}</span>}
          {a.code && (
            <button
              onClick={() => { navigator.clipboard?.writeText(a.code!).catch(() => {}); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}
              className="shrink-0 whitespace-nowrap rounded-full bg-pink px-2.5 py-0.5 text-[0.65rem] font-bold tracking-[0.14em] text-white transition hover:bg-white hover:text-ink"
              aria-label={`Copy discount code ${a.code}`}
            >
              {copied ? "Copied" : <><span className="max-sm:hidden">Code: </span>{a.code}</>}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
