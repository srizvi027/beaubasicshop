"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * Reveals text word-by-word, each word sliding up out of a mask.
 * `lines` lets you control line breaks precisely for display headings.
 */
export function MaskText({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.06,
  play,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** If provided, animates when true instead of on scroll */
  play?: boolean;
}) {
  const reduce = useReducedMotion();
  let i = 0;
  const trigger =
    play === undefined
      ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } }
      : { initial: "hidden", animate: play ? "show" : "hidden" };

  return (
    <Tag className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <motion.span aria-hidden className="block" {...trigger}>
        {lines.map((line, li) => (
          <span key={li} className={cn("block", lineClassName)}>
            {line.split(" ").map((word, wi) => {
              const d = delay + i++ * stagger;
              return (
                <span key={wi} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 },
                      show: { y: "0%", opacity: 1, transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    {word}
                  </motion.span>
                  {wi < line.split(" ").length - 1 && "\u00A0"}
                </span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
