"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { MaskText } from "@/components/animations/MaskText";
import { LogoMark } from "@/components/ui/LogoMark";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus("error");
    // TODO: connect to Klaviyo / Mailchimp / Shopify customer API here.
    setStatus("done");
  };

  return (
    <section aria-label="Newsletter" className="relative overflow-hidden bg-pink text-ink">
      <LogoMark aria-hidden className="pointer-events-none absolute -right-[6%] -top-[20%] h-[150%] w-auto text-white/25" />
      <div className="relative mx-auto max-w-[1600px] px-4 py-24 md:px-10 md:py-32">
        <MaskText lines={["Your beauty list", "just got better."]} className="display text-[clamp(3rem,8vw,8.6rem)]" />
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <p className="max-w-[40ch] text-lg leading-relaxed lg:col-span-4">
            New arrivals, restocks and member-only offers — plus 10% off your first order of $120+.
          </p>
          <div className="lg:col-span-7 lg:col-start-6">
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.p key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 text-2xl font-semibold" role="status">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-white"><Check className="h-5 w-5" /></span>
                  You’re on the list. Check your inbox for your welcome code.
                </motion.p>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="flex-1">
                    <span className="mb-2 block text-sm font-semibold">Email address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={status === "error"}
                      aria-describedby="nl-error"
                      className="h-14 w-full border-b-2 border-ink bg-transparent text-xl placeholder:text-ink/45 focus:outline-none"
                    />
                  </label>
                  <button type="submit" className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-ink px-8 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-plum">
                    Join the list <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            <p id="nl-error" className="mt-3 min-h-5 text-sm font-semibold text-plum" aria-live="polite">
              {status === "error" && "Enter an email address like name@example.com."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
