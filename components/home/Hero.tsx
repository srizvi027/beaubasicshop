"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Truck, CreditCard, MapPin } from "lucide-react";
import { useUI } from "@/components/store/ui";
import { MaskText } from "@/components/animations/MaskText";
import { Magnetic } from "@/components/animations/Magnetic";
import { ButtonLink } from "@/components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { introDone } = useUI();
  const reduce = useReducedMotion();
  const play = introDone ? "show" : "hidden";

  // Pointer-driven depth on the floating products (desktop only, responds to the user)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const nearX = useTransform(sx, (v) => v * 22);
  const nearY = useTransform(sy, (v) => v * 16);
  const farX = useTransform(sx, (v) => v * -10);
  const farY = useTransform(sy, (v) => v * -8);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const rise = (delay: number) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: EASE } },
  });

  return (
    <section
      aria-label="Introduction"
      onPointerMove={onMove}
      className="relative overflow-hidden bg-paper"
    >
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 pb-14 pt-8 md:px-10 lg:min-h-[calc(100svh-7.5rem)] lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-16 lg:pt-6">
        {/* ── Copy ── */}
        <div className="relative z-10 lg:col-span-7">
          <MaskText
            as="h1"
            lines={["Beauty from", "across Asia,", "delivered to", "Australia."]}
            className="display text-[clamp(3.6rem,8.6vw,9.6rem)]"
            lineClassName="[&:nth-child(2)]:pl-[0.6em] [&:nth-child(4)]:pl-[1.2em] max-sm:!pl-0"
            play={introDone}
            delay={0.05}
            stagger={0.05}
          />

          <motion.p initial="hidden" animate={play} variants={rise(0.55)} className="mt-8 max-w-[44ch] text-[1.05rem] leading-relaxed text-black/70 md:text-lg">
            Curated Filipino and Asian beauty, skincare, wellness and the snacks you grew up with — hand-picked and shipped to your door anywhere in Australia.
          </motion.p>

          <motion.div initial="hidden" animate={play} variants={rise(0.7)} className="mt-9 flex flex-wrap gap-3">
            <Magnetic><ButtonLink href="/collections/beauty">Shop Beauty</ButtonLink></Magnetic>
            <Magnetic><ButtonLink href="/collections/best-sellers" variant="outline">Explore Best Sellers</ButtonLink></Magnetic>
          </motion.div>

          <motion.ul initial="hidden" animate={play} variants={rise(0.85)} className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[0.82rem] text-black/65">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-blue" /> Free shipping over $100</li>
            <li className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-blue" /> Afterpay available</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue" /> Packed in Gnowangerup, WA</li>
          </motion.ul>
        </div>

        {/* ── Visual ── */}
        <div className="relative mx-auto w-full max-w-[520px] lg:col-span-5 lg:max-w-none">
          <div className="relative mx-auto aspect-[4/5] w-[78%] lg:w-[82%]">
            {/* Arch background */}
            <motion.div
              className="absolute inset-0 rounded-t-full bg-blush"
              initial={{ scaleY: reduce ? 1 : 0.4, opacity: 0 }}
              animate={introDone ? { scaleY: 1, opacity: 1 } : {}}
              style={{ originY: 1 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
            {/* Campaign image in the arch */}
            <motion.div
              className="absolute inset-[5%] overflow-hidden rounded-t-full"
              initial={{ clipPath: "inset(100% 0% 0% 0% round 999px 999px 0px 0px)" }}
              animate={introDone ? { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)" } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            >
              <motion.div className="absolute inset-0" style={{ x: farX, y: farY, scale: 1.08 }}>
                <Image
                  src="/images/editorial/you-glow-babe.webp"
                  alt="Five women in pink activewear holding Filipino wellness products"
                  fill
                  priority
                  sizes="(min-width: 1024px) 34vw, 70vw"
                  className="object-cover object-[50%_30%]"
                />
              </motion.div>
            </motion.div>

            {/* Route line: Manila → Western Australia */}
            <svg viewBox="0 0 400 500" className="pointer-events-none absolute -inset-x-[14%] -inset-y-[6%] h-[112%] w-[128%] overflow-visible" aria-hidden>
              <motion.path
                d="M 36 70 C 120 -20, 330 10, 368 150 S 330 420, 300 470"
                fill="none"
                stroke="#116DFF"
                strokeWidth="1.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={introDone ? { pathLength: 1 } : {}}
                transition={{ duration: 1.6, delay: 0.9, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.circle cx="36" cy="70" r="5" fill="#116DFF" initial={{ scale: 0 }} animate={introDone ? { scale: 1 } : {}} transition={{ delay: 0.9 }} />
              <motion.circle cx="300" cy="470" r="5" fill="#FB6B90" initial={{ scale: 0 }} animate={introDone ? { scale: 1 } : {}} transition={{ delay: 2.4 }} />
            </svg>
            <motion.span className="absolute -left-[16%] -top-[8%] text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-blue" initial={{ opacity: 0 }} animate={introDone ? { opacity: 1 } : {}} transition={{ delay: 1 }}>
              Manila
            </motion.span>
            <motion.span className="absolute -bottom-[7%] right-[6%] text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-pink" initial={{ opacity: 0 }} animate={introDone ? { opacity: 1 } : {}} transition={{ delay: 2.4 }}>
              Your door, WA
            </motion.span>

            {/* Floating products */}
            <motion.div
              className="absolute -bottom-[6%] -left-[18%] w-[52%] drop-shadow-[0_24px_30px_rgba(40,26,57,0.25)]"
              initial={{ opacity: 0, x: reduce ? 0 : -60, rotate: 0 }}
              animate={introDone ? { opacity: 1, x: 0, rotate: -8 } : {}}
              transition={{ duration: 1.1, delay: 0.75, ease: EASE }}
            >
              <motion.div style={{ x: nearX, y: nearY }}>
                <Image src="/images/products/hikari-pure-barley-plus-cutout.webp" alt="" width={700} height={630} sizes="20vw" className="h-auto w-full" />
              </motion.div>
            </motion.div>
            <motion.div
              className="absolute -right-[7%] top-[14%] w-[34%] drop-shadow-[0_18px_24px_rgba(40,26,57,0.22)]"
              initial={{ opacity: 0, y: reduce ? 0 : -50, rotate: 0 }}
              animate={introDone ? { opacity: 1, y: 0, rotate: 12 } : {}}
              transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
            >
              <motion.div style={{ x: nearX, y: nearY }}>
                <Image src="/images/products/bys-compact-powder-medium-cutout.webp" alt="" width={700} height={700} sizes="14vw" className="h-auto w-full" />
              </motion.div>
            </motion.div>

            {/* Rotating stamp — the only ambient motion on the page */}
            <motion.div
              className="absolute -right-[4%] bottom-[10%] grid h-28 w-28 place-items-center rounded-full bg-ink text-white md:h-32 md:w-32"
              initial={{ scale: 0 }}
              animate={introDone ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 1.1 }}
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full motion-safe:animate-[spin_24s_linear_infinite]" aria-hidden>
                <defs><path id="stamp" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>
                <text fontSize="9.2" fontWeight="600" letterSpacing="2.6" fill="currentColor">
                  <textPath href="#stamp">AUTHENTIC • SHIPPED AUSTRALIA-WIDE •</textPath>
                </text>
              </svg>
              <span className="font-serif text-3xl text-pink">&amp;</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
