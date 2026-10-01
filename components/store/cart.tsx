"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { CartLine, Product, ProductVariant } from "@/lib/types";
import { getPricing } from "@/lib/pricing";
import { getBrandName } from "@/data/brands";
import { FREE_SHIPPING_THRESHOLD } from "@/data/site";

type Action =
  | { type: "add"; line: CartLine }
  | { type: "qty"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "clear" };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "add": {
      const existing = state.find((l) => l.key === action.line.key);
      if (existing) return state.map((l) => (l.key === action.line.key ? { ...l, quantity: Math.min(99, l.quantity + action.line.quantity) } : l));
      return [...state, action.line];
    }
    case "qty":
      return action.quantity <= 0 ? state.filter((l) => l.key !== action.key) : state.map((l) => (l.key === action.key ? { ...l, quantity: Math.min(99, action.quantity) } : l));
    case "remove":
      return state.filter((l) => l.key !== action.key);
    case "hydrate":
      return action.lines;
    case "clear":
      return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  isOpen: boolean;
  /** increments on every add — used to "bump" the cart icon */
  pulse: number;
  open: () => void;
  close: () => void;
  addItem: (product: Product, opts?: { variant?: ProductVariant; quantity?: number; openDrawer?: boolean }) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bb-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const addItem = useCallback<CartContextValue["addItem"]>((product, opts = {}) => {
    const { variant, quantity = 1, openDrawer = true } = opts;
    const pricing = getPricing(product, variant);
    dispatch({
      type: "add",
      line: {
        key: `${product.id}:${variant?.id ?? "default"}`,
        productId: product.id,
        variantId: variant?.id,
        slug: product.slug,
        name: product.name,
        brand: getBrandName(product.brand),
        variantName: variant?.name,
        image: variant?.image ?? product.images[0],
        unitPrice: pricing.current,
        quantity,
      },
    });
    setPulse((p) => p + 1);
    if (openDrawer) window.setTimeout(() => setOpen(true), 450);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    return {
      lines,
      count,
      subtotal,
      freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
      freeShippingProgress: Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD),
      isOpen,
      pulse,
      open: () => setOpen(true),
      close: () => setOpen(false),
      addItem,
      setQuantity: (key, quantity) => dispatch({ type: "qty", key, quantity }),
      removeItem: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [lines, isOpen, pulse, addItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
