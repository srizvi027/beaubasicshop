/**
 * Simple content pages rendered at /pages/[slug].
 * Each section is a heading + paragraphs. Please review all policy copy
 * with the business owner before launch — these are sensible starting drafts.
 */
export interface InfoPage {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

export const infoPages: InfoPage[] = [
  {
    slug: "shipping",
    title: "Shipping",
    intro: "Every order is packed by hand in Gnowangerup, WA and sent Australia-wide.",
    sections: [
      {
        heading: "Rates",
        body: [
          "Standard shipping is free on orders over $100. Orders under $100 ship for a flat $10.95.",
          "Afterpay is available at checkout — pay in four interest-free instalments.",
        ],
      },
      {
        heading: "Delivery times",
        body: [
          "Orders are dispatched within 1–2 business days. Most metro areas receive orders within 3–7 business days; regional and remote areas may take longer.",
          "You will receive a tracking link by email as soon as your parcel leaves us.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    intro: "Not quite right? We’ll help you sort it out.",
    sections: [
      {
        heading: "Change of mind",
        body: [
          "For hygiene reasons, opened beauty, skincare and food products can’t be returned for change of mind. Unopened items in original condition can be returned within 14 days of delivery.",
        ],
      },
      {
        heading: "Damaged or faulty items",
        body: [
          "If something arrives damaged or faulty, email us within 7 days with your order number and a photo and we’ll replace or refund it.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    intro: "Questions about an order or a product? We usually reply within one business day.",
    sections: [
      { heading: "Email", body: ["hello@beaubasicshop.com.au"] },
      { heading: "Where we are", body: ["Beau & Basic Shop, Gnowangerup WA 6335, Australia. Online store only."] },
    ],
  },
  {
    slug: "refer-a-friend",
    title: "Refer a Friend",
    intro: "Share Beau & Basic and you both get rewarded.",
    sections: [
      {
        heading: "How it works",
        body: [
          "Send your personal link from your account page. Your friend gets $10 off their first order of $60+, and you earn 200 Beau Points once their order ships.",
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro: "How we collect, use and protect your personal information.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "We collect the details you give us when you place an order, create an account or join our list — such as your name, email, phone number and delivery address.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your information to process orders, provide customer support and, if you opt in, send marketing emails. We never sell your personal information.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    intro: "The terms that apply when you shop with Beau & Basic.",
    sections: [
      {
        heading: "Orders and pricing",
        body: [
          "All prices are in Australian dollars and include GST. We reserve the right to cancel orders affected by pricing errors or stock unavailability, with a full refund.",
        ],
      },
    ],
  },
];

export const getInfoPage = (slug: string) => infoPages.find((p) => p.slug === slug);
