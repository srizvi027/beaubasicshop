import type { Category } from "@/lib/types";

/**
 * Shop categories. Order here = order in navigation and on the home page.
 */
export const categories: Category[] = [
  {
    slug: "skincare",
    name: "Skincare",
    tagline: "Glass-skin routines, minus the guesswork.",
    description: "Cleansers, exfoliating bars, serums and SPF from the best of Filipino and Asian skincare.",
    image: { src: "/images/products/eirian-peeling-fine-bar-4.webp", alt: "Eirian Skin Peeling-Fine Bar on a warm cream background" },
    tone: "#EFEBE0",
    subcategories: ["Cleansers & Exfoliators", "Sun Care", "Oil Control", "Body Care"],
  },
  {
    slug: "beauty",
    name: "Beauty",
    tagline: "Everyday makeup that travels well.",
    description: "Powders, lip creams and the little tools that live in your handbag.",
    image: { src: "/images/editorial/you-glow-babe.webp", alt: "Five women in pink activewear holding beauty products" },
    tone: "#FFE4EC",
    subcategories: ["Face", "Lips", "Tools & Accessories"],
  },
  {
    slug: "hair-care",
    name: "Hair Care",
    tagline: "Treatments Manila swears by.",
    description: "Masks, oils and shampoos for soft, glossy hair.",
    image: { src: "/images/demo/creamsilk-hair-reborn-3.svg", alt: "Hair treatment jar illustration" },
    tone: "#F0F0F0",
    subcategories: ["Treatments", "Shampoo & Conditioner", "Oils"],
  },
  {
    slug: "wellness",
    name: "Wellness",
    tagline: "Daily rituals from the inside out.",
    description: "Barley, moringa and ginger blends for your morning routine.",
    image: { src: "/images/products/hikari-pure-barley-plus-2.webp", alt: "Hikari Pure Barley Plus box on blush pink" },
    tone: "#FFE4EC",
    subcategories: ["Supplements", "Teas & Drinks"],
  },
  {
    slug: "filipino-food",
    name: "Filipino Food",
    tagline: "Pasalubong, delivered.",
    description: "The snacks, sweets and pantry staples you grew up with.",
    image: { src: "/images/demo/7d-dried-mangoes-3.svg", alt: "Dried mangoes pouch illustration" },
    tone: "#281A39",
    subcategories: ["Snacks", "Sweets", "Pantry"],
  },
  {
    slug: "kids-family",
    name: "Kids & Family",
    tagline: "Gentle care for the little ones.",
    description: "Baby powders, colognes and family favourites.",
    image: { src: "/images/demo/tiny-buds-baby-powder-2.svg", alt: "Baby powder bottle illustration" },
    tone: "#F6F6F6",
    subcategories: ["Baby Care", "Family"],
  },
];

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));
