import { NextRequest, NextResponse } from "next/server";
import {
  fetchStockPerformance,
  type StockRange,
} from "@/services/stockPerformanceService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_RANGES: StockRange[] = ["1d", "1w", "1m", "6m", "1y", "5y", "max"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol")?.trim();
    const rangeParam = searchParams.get("range")?.trim().toLowerCase();
    const range = VALID_RANGES.includes(rangeParam as StockRange)
      ? (rangeParam as StockRange)
      : "1d";

    if (!symbol) {
      return NextResponse.json(
        { error: "symbol is required." },
        { status: 400 }
      );
    }

    const data = await fetchStockPerformance(symbol, range);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("GET /api/stock-performance failed:", err);
    return NextResponse.json(
      {
        error:
          err?.message ??
          "Unable to fetch stock performance data for this company.",
      },
      { status: 500 }
    );
  }
}
