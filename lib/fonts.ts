import localFont from "next/font/local";

/**
 * Fonts are self-hosted (SIL Open Font License) so builds never depend on
 * Google Fonts being reachable, and there's no third-party request at runtime.
 */

/** Archivo — a grotesque with a width axis. Condensed for display, normal for UI. */
export const archivo = localFont({
  src: [{ path: "../app/fonts/Archivo-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

/** Bodoni Moda — fashion-editorial serif for the wordmark and editorial moments. */
export const bodoni = localFont({
  src: [
    { path: "../app/fonts/BodoniModa-Variable.woff2", weight: "400 900", style: "normal" },
    { path: "../app/fonts/BodoniModa-Italic-Variable.woff2", weight: "400 900", style: "italic" },
  ],
  variable: "--font-bodoni",
  display: "swap",
  fallback: ["Didot", "Georgia", "serif"],
});
