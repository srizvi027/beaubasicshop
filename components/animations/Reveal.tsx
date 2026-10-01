"use client";

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

type Base = Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport"> & { delay?: number; as?: "div" | "section" | "li" | "span" };

/** Fade + gentle rise when scrolled into view. The workhorse. */
export function Reveal({ delay = 0, y = 28, className, children, ...rest }: Base & { y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ delay = 0, className, children, ...rest }: Base) {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT} transition={{ duration: 1, delay, ease: EASE }} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

export function SlideUp(props: Base) {
  return <Reveal y={60} {...props} />;
}

/** Image wrapper: clips in from the bottom while the image settles from 0.96 → 1. */
export function ImageReveal({ delay = 0, className, children, ...rest }: Base) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)", opacity: 1 }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, delay, ease: EASE }}
      className={cn("overflow-hidden", className)}
      {...rest}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: reduce ? 1 : 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.6, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({ transition: { staggerChildren: stagger } }),
};
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function StaggerChildren({ stagger = 0.08, className, children, ...rest }: Base & { stagger?: number }) {
  return (
    <motion.div variants={containerVariants} custom={stagger} initial="hidden" whileInView="show" viewport={VIEWPORT} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ className, children, ...rest }: Omit<HTMLMotionProps<"div">, "variants">) {
  return (
    <motion.div variants={staggerItem} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
