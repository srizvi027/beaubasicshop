"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUI } from "@/components/store/ui";
import { LogoMark } from "@/components/ui/LogoMark";

const KEY = "bb-intro";
const EASE = [0.22, 1, 0.36, 1] as const;
const WORD = "Beau&Basic".split("");

/**
 * ~1.4s brand intro. Shows once per browser session, never on client-side
 * navigation, and is skipped entirely with prefers-reduced-motion.
 * An inline script in <head> hides it before paint if it has already played.
 */
export function IntroLoader() {
  const { setIntroDone } = useUI();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = document.documentElement.dataset.intro === "done";
    if (seen) {
      setVisible(false);
      setIntroDone(true);
      return;
    }
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    const t = window.setTimeout(() => setVisible(false), 950);
    return () => window.clearTimeout(t);
  }, [setIntroDone]);

  return (
    <AnimatePresence onExitComplete={() => { document.documentElement.dataset.intro = "done"; setIntroDone(true); }}>
      {visible && (
        <motion.div
          className="intro-loader fixed inset-0 z-[100] flex items-center justify-center bg-paper"
          aria-hidden="true"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            {/* Mark draws upward */}
            <motion.div initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 0.7, ease: EASE }}>
              <LogoMark className="h-28 w-auto text-pink md:h-36" />
            </motion.div>

            {/* Small marks settle into place */}
            {[
              { x: -70, y: -40, c: "bg-pink", s: "h-2 w-2" },
              { x: 74, y: -18, c: "bg-blue", s: "h-1.5 w-1.5" },
              { x: -54, y: 46, c: "bg-blush", s: "h-3 w-3" },
              { x: 62, y: 52, c: "bg-plum", s: "h-1 w-1" },
            ].map((d, i) => (
              <motion.span
                key={i}
                className={`absolute left-1/2 top-16 rounded-full ${d.c} ${d.s}`}
                initial={{ x: d.x * 1.8, y: d.y * 1.8, opacity: 0 }}
                animate={{ x: d.x, y: d.y, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: EASE }}
              />
            ))}

            <div className="mt-5 flex overflow-hidden font-serif text-4xl tracking-[-0.02em] md:text-5xl">
              {WORD.map((ch, i) => (
                <motion.span
                  key={i}
                  className={ch === "&" ? "text-pink" : ""}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.22 + i * 0.03, ease: EASE }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* Colour sweep line */}
            <div className="relative mt-4 h-px w-44 overflow-hidden bg-black/10">
              <motion.span
                className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-pink via-pink to-blue"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.75, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
            <motion.p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.5 }}>
              Beauty | Wellness &amp; More
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
