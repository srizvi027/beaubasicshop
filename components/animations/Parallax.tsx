"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Subtle vertical parallax for editorial imagery. Give it a height via className;
 * children should fill it (e.g. a `fill` Next Image). `amount` is in px.
 */
export function Parallax({ children, amount = 50, className }: { children: React.ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y, top: -amount, bottom: -amount }} className="absolute inset-x-0">
        {children}
      </motion.div>
    </div>
  );
}
