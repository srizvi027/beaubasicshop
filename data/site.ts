/**
 * Site-wide settings. Edit copy, promos and links here — no component changes needed.
 */

export const site = {
  name: "Beau & Basic Shop",
  shortName: "Beau&Basic",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.beaubasicshop.com.au",
  description:
    "Curated Filipino and Asian beauty, skincare, wellness and food — delivered across Australia from Gnowangerup, WA.",
  locale: "en_AU",
  currency: "AUD",
  instagram: "BeauAndBasic",
  instagramUrl: "https://www.instagram.com/beauandbasic",
  facebookUrl: "https://www.facebook.com/beauandbasic",
  email: "hello@beaubasicshop.com.au",
  location: {
    town: "Gnowangerup",
    state: "WA",
    country: "Australia",
    note: "Packed with care in regional Western Australia",
  },
};

/** Free-shipping threshold (AUD) — drives the cart progress bar. */
export const FREE_SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING_COST = 10.95;

/**
 * Announcement bar. Messages rotate in order.
 * `href` is optional; `code` is shown as a tap-to-copy chip.
 */
export const announcements: { text: string; code?: string; href?: string }[] = [
  { text: "10% off for new customers on orders $120+", code: "BEAU10" },
  { text: "Free standard shipping on orders over $100", href: "/pages/shipping" },
  { text: "Afterpay available — shop now, pay in 4", href: "/pages/shipping" },
];

/** Main navigation. `mega: true` shows the mega menu on desktop hover. */
export const mainNav: { label: string; href: string; mega?: "shop" | "category"; category?: string }[] = [
  { label: "Shop", href: "/shop", mega: "shop" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Beauty", href: "/collections/beauty", mega: "category", category: "beauty" },
  { label: "Skincare", href: "/collections/skincare", mega: "category", category: "skincare" },
  { label: "Hair Care", href: "/collections/hair-care", mega: "category", category: "hair-care" },
  { label: "Wellness", href: "/collections/wellness", mega: "category", category: "wellness" },
  { label: "Filipino Food", href: "/collections/filipino-food", mega: "category", category: "filipino-food" },
  { label: "Sale", href: "/collections/sale" },
];

export const popularSearches = ["Barley", "Exfoliating bar", "Sunscreen", "Dried mangoes", "Lip cream", "Blotting paper"];

export const loyalty = {
  name: "Beau Points",
  earnRate: "1 point for every $1 you spend",
  // Placeholder redemption + tier rules — confirm with the business before launch.
  redeem: "Redeem 100 points for $5 off. Points never expire while you’re active.",
  ways: [
    { points: 100, label: "When you create an account", icon: "sparkles" },
    { points: 100, label: "On your birthday", icon: "cake" },
    { points: 100, label: "For following us on Instagram", icon: "heart" },
  ],
  tiers: [
    { name: "Basic", threshold: 0, perks: ["1 point per $1", "Birthday points", "Member-only sales"] },
    { name: "Beau", threshold: 500, perks: ["1.25 points per $1", "Early access to new arrivals", "Free gift on orders $80+"] },
    { name: "Beau Icon", threshold: 1500, perks: ["1.5 points per $1", "Free express shipping", "Surprise gift every quarter"] },
  ],
};

export const footerNav = [
  {
    title: "Shop",
    links: [
      { label: "Shop all", href: "/shop" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Filipino Food", href: "/collections/filipino-food" },
      { label: "Sale", href: "/collections/sale" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Shipping", href: "/pages/shipping" },
      { label: "Returns", href: "/pages/returns" },
      { label: "Contact", href: "/pages/contact" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Loyalty", href: "/loyalty" },
      { label: "Refer a Friend", href: "/pages/refer-a-friend" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Privacy Policy", href: "/pages/privacy-policy" },
      { label: "Terms", href: "/pages/terms" },
    ],
  },
];
