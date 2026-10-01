# Beau & Basic Shop — Next.js storefront

Premium, animated ecommerce front-end for Beau & Basic Shop (Gnowangerup, WA).
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.beaubasicshop.com.au`) for canonical URLs, Open Graph and the sitemap.

---

## Adding / editing products (the important bit)

Everything lives in **`data/products.ts`**. The top of that file has a copy-paste template.

1. Put photos in `public/images/products/` (square, ideally 1200px+, white or transparent background).
2. Paste a new product object at the end of the `products` array and fill it in.
3. Save. It now appears in its category, search, filters, the sitemap and at `/products/<slug>`.

Flags that control placement:

| Field | Effect |
|---|---|
| `bestseller: true` | Best Sellers section + `/collections/best-sellers` |
| `newArrival: true` | New Arrivals + "New" badge |
| `salePrice` (lower than `price`) | Sale section + `/collections/sale` + "% off" badge |
| `compareAtPrice` | Struck-through RRP |
| `featured: true` | Featured in the desktop mega menus |
| `stock: "low_stock"` + `quantityAvailable` | "Only X left" |
| `stock: "out_of_stock"` | "Sold out", moved to the end of listings |
| `variants` + `variantLabel` | Size/pack/shade selector (add `swatch` for colour dots) |

Other editable data:

- `data/brands.ts` — brand names (a product's `brand` is a slug from here)
- `data/categories.ts` — categories, taglines, card images, subcategories
- `data/site.ts` — **promo bar messages**, navigation, free-shipping threshold, popular searches, loyalty copy, footer links
- `data/pages.ts` — Shipping, Returns, Contact, Privacy, Terms, Refer a Friend

## Connecting a real backend

UI components never import `data/products.ts` directly. Everything goes through `lib/catalog/index.ts`
(`getProductBySlug`, `getProductsByCategory`, `getBestSellers`, `getNewArrivals`, `getSaleProducts`,
`getRelatedProducts`, `searchProducts`, …), which reads from a **`CatalogSource`** (`lib/catalog/source.ts`).

To switch to Shopify / Sanity / Supabase / WooCommerce / Medusa:

1. Create `lib/catalog/shopify-source.ts` implementing `listProducts()` and `getProductBySlug()` (and optionally `search()`), mapping the API response to the `Product` type in `lib/types.ts`.
2. Change the one `source` line in `lib/catalog/index.ts`.
3. Add the image host to `images.remotePatterns` in `next.config.ts`.
4. Point the checkout button (`components/shop/CheckoutView.tsx`) at the backend's hosted checkout, and the newsletter form (`components/home/Newsletter.tsx`) at your email platform.

For very large catalogues, move filtering server-side: `lib/filters.ts` is pure and can run on the server or be translated into your backend's query.

## Structure

```
app/                     routes: home, shop, collections/[slug], products/[slug], wishlist,
                         checkout, about, loyalty, pages/[slug], api/search, sitemap, robots
components/animations/   Reveal, FadeIn, SlideUp, ImageReveal, StaggerChildren, MaskText,
                         Magnetic, Parallax, Counter, PageTransition
components/product/      ProductCard, ProductGrid, ProductGallery, ProductDetails, ProductQuickView,
                         ProductBadge, AddToCartButton, QuantitySelector, VariantSelector,
                         WishlistButton, RelatedProducts
components/shop/         CartDrawer, ProductSearch, ProductFilters, ShopView, …
components/navigation/   AnnouncementBar, Header, MegaMenu, MobileMenu, IntroLoader, Footer
components/home/         Homepage sections
components/store/        Cart, wishlist and UI state (persisted in localStorage)
data/                    Products, brands, categories, site config, content pages
lib/                     Types, catalog layer, pricing, filters, SEO helpers, fonts
```

## Notes before launch

- **Photos:** the four live product photos supplied were 255px; they've been upscaled but will look soft on large screens. Replace with originals.
- **Demo products:** the 16 products under "DEMO PRODUCTS" in `data/products.ts` use generated placeholder art from `public/images/demo` (`npm run placeholders` regenerates them). Replace or delete.
- **Copy to confirm:** product descriptions were written from the packaging; loyalty redemption/tier rules and policy pages are sensible drafts.
- The intro loader plays once per browser session and is skipped with `prefers-reduced-motion`.
- Fonts (Archivo, Bodoni Moda — SIL OFL) are self-hosted in `app/fonts`.
