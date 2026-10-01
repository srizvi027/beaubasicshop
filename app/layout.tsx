import type { Metadata, Viewport } from "next";
import "./globals.css";
import { archivo, bodoni } from "@/lib/fonts";
import { site } from "@/data/site";
import { getMegaMenuData } from "@/lib/catalog";
import { organizationJsonLd } from "@/lib/seo";
import { AppProviders } from "@/components/providers/AppProviders";
import { AnnouncementBar } from "@/components/navigation/AnnouncementBar";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { IntroLoader } from "@/components/navigation/IntroLoader";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductSearch } from "@/components/shop/ProductSearch";
import { ProductQuickView } from "@/components/product/ProductQuickView";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Asian & Filipino Beauty, Delivered in Australia`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  icons: { icon: "/images/brand/mark.svg" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    title: site.name,
    description: site.description,
    images: [{ url: "/images/editorial/you-glow-babe.webp", width: 1138, height: 1046, alt: site.name }],
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: ["/images/editorial/you-glow-babe.webp"] },
};

export const viewport: Viewport = { themeColor: "#FFFFFE", width: "device-width", initialScale: 1 };

// Runs before paint: skip the intro if it already played this session or motion is reduced.
const introScript = `try{if(sessionStorage.getItem('bb-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='done'}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const megaData = await getMegaMenuData();
  return (
    <html lang="en-AU" className={`${archivo.variable} ${bodoni.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      </head>
      <body>
        <AppProviders>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white">Skip to content</a>
          <IntroLoader />
          <AnnouncementBar />
          <Header megaData={megaData} />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <ProductSearch />
          <ProductQuickView />
        </AppProviders>
      </body>
    </html>
  );
}
