import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";

/** GET /api/search?q=barley&limit=8 — powers the search overlay. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").slice(0, 80);
  const limit = Math.min(24, Number(searchParams.get("limit") ?? 8) || 8);
  const products = await searchProducts(q, limit);
  return NextResponse.json({ products }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
