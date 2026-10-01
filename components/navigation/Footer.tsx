import Link from "next/link";
import { MapPin } from "lucide-react";
import { footerNav, site } from "@/data/site";
import { LogoMark } from "@/components/ui/LogoMark";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cream text-plum">
      <div className="mx-auto max-w-[1600px] px-4 pt-20 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <LogoMark className="h-16 w-auto text-pink" />
            <p className="editorial mt-6 max-w-sm text-2xl leading-snug">
              Filipino and Asian beauty, chosen by hand and packed with care in regional WA.
            </p>
            <address className="mt-8 flex items-start gap-3 not-italic text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pink" />
              <span>
                {site.name}<br />
                {site.location.town} {site.location.state} 6335, {site.location.country}<br />
                <a href={`mailto:${site.email}`} className="link-underline">{site.email}</a>
              </span>
            </address>
            <div className="mt-6 flex gap-2">
              <a href={site.instagramUrl} aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full border border-plum/20 transition hover:border-pink hover:bg-pink hover:text-white"><InstagramIcon className="h-[18px] w-[18px]" /></a>
              <a href={site.facebookUrl} aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full border border-plum/20 transition hover:border-pink hover:bg-pink hover:text-white"><FacebookIcon className="h-[18px] w-[18px]" /></a>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h2 className="mb-5 text-sm font-semibold">{col.title}</h2>
                <ul className="space-y-3 text-sm text-plum/75">
                  {col.links.map((l) => (
                    <li key={l.href}><Link href={l.href} className="link-underline hover:text-plum">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-plum/15 py-6 text-xs text-plum/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Prices in AUD, GST included.</p>
          <p className="flex flex-wrap gap-2">
            {["Visa", "Mastercard", "Afterpay", "PayPal"].map((m) => (
              <span key={m} className="rounded border border-plum/20 px-2 py-1 font-semibold">{m}</span>
            ))}
          </p>
        </div>
      </div>

      {/* Oversized wordmark — the footer's signature */}
      <p aria-hidden className="pointer-events-none -mb-[0.22em] select-none whitespace-nowrap text-center font-serif text-[18.5vw] leading-[0.8] tracking-[-0.05em] text-pink">
        Beau&amp;Basic
      </p>
    </footer>
  );
}
