import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export type StockRange = "1d" | "1w" | "1m" | "6m" | "1y" | "5y" | "max";

export interface StockPricePoint {
  date: string;
  price: number;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
  percentChange: number;
}

export interface StockPerformanceEvent {
  date: string;
  title: string;
  description: string;
  type: "move" | "dividend" | "split";
  percentChange?: number;
}

export interface StockPerformanceData {
  symbol: string;
  longName: string | null;
  currency: string | null;
  range: StockRange;
  interval: string;
  ipoDate: string | null;
  generatedAt: string;
  source: string;
  openPrice: number | null;
  closePrice: number | null;
  highPrice: number | null;
  lowPrice: number | null;
  previousClose: number | null;
  priceChange: number | null;
  percentChange: number | null;
  behavior: "up" | "down" | "flat";
  points: StockPricePoint[];
  events: StockPerformanceEvent[];
}

interface RangeConfig {
  period1: Date;
  interval: "5m" | "15m" | "1h" | "1d" | "1wk" | "1mo";
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function fetchStockPerformance(
  symbol: string,
  range: StockRange
): Promise<StockPerformanceData> {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const now = new Date();
  const config = getRangeConfig(range, now);

  const chart = await yahooFinance.chart(normalizedSymbol, {
    period1: config.period1,
    period2: now,
    interval: config.interval,
    includePrePost: range === "1d",
    events: "div|split",
  });

  const quotes = chart.quotes
    .filter((quote) => quote.close != null)
    .map((quote) => ({
      date: quote.date.toISOString(),
      price: quote.close as number,
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      volume: quote.volume,
    }));

  if (quotes.length === 0) {
    throw new Error(`No stock performance data found for ${normalizedSymbol}.`);
  }

  const firstPrice = quotes[0].price;
  const points = quotes.map((quote) => ({
    ...quote,
    percentChange: calculatePercentChange(quote.price, firstPrice),
  }));

  const openPrice = firstNonNull(points.map((point) => point.open)) ?? points[0].price;
  const closePrice = points[points.length - 1].price;
  const highPrice = maxValue(points.map((point) => point.high ?? point.price));
  const lowPrice = minValue(points.map((point) => point.low ?? point.price));
  const previousClose = chart.meta.previousClose ?? chart.meta.chartPreviousClose ?? null;
  const priceChange = closePrice - openPrice;
  const percentChange = calculatePercentChange(closePrice, openPrice);

  return {
    symbol: chart.meta.symbol ?? normalizedSymbol,
    longName: chart.meta.longName ?? chart.meta.shortName ?? null,
    currency: chart.meta.currency ?? null,
    range,
    interval: config.interval,
    ipoDate: chart.meta.firstTradeDate?.toISOString() ?? null,
    generatedAt: now.toISOString(),
    source: "Yahoo Finance",
    openPrice,
    closePrice,
    highPrice,
    lowPrice,
    previousClose,
    priceChange,
    percentChange,
    behavior: getBehavior(percentChange),
    points,
    events: buildEvents(chart.events, points, range),
  };
}

function getRangeConfig(range: StockRange, now: Date): RangeConfig {
  switch (range) {
    case "1d":
      return { period1: new Date(now.getTime() - DAY_MS), interval: "5m" };
    case "1w":
      return { period1: new Date(now.getTime() - 7 * DAY_MS), interval: "15m" };
    case "1m":
      return { period1: new Date(now.getTime() - 31 * DAY_MS), interval: "1d" };
    case "6m":
      return { period1: new Date(now.getTime() - 183 * DAY_MS), interval: "1d" };
    case "1y":
      return { period1: new Date(now.getTime() - 365 * DAY_MS), interval: "1d" };
    case "5y":
      return { period1: new Date(now.getTime() - 5 * 365 * DAY_MS), interval: "1wk" };
    case "max":
      return { period1: new Date("1900-01-01T00:00:00.000Z"), interval: "1mo" };
  }
}

function buildEvents(
  chartEvents: any,
  points: StockPricePoint[],
  range: StockRange
): StockPerformanceEvent[] {
  const corporateEvents: StockPerformanceEvent[] = [
    ...(chartEvents?.dividends ?? []).map((event: any) => ({
      date: event.date.toISOString(),
      title: "Dividend",
      description: `Dividend paid: ${event.amount}`,
      type: "dividend" as const,
    })),
    ...(chartEvents?.splits ?? []).map((event: any) => ({
      date: event.date.toISOString(),
      title: "Stock split",
      description: `Split ratio ${event.splitRatio}`,
      type: "split" as const,
    })),
  ];

  const moveThreshold = range === "1d" ? 1 : range === "1w" ? 3 : 8;
  const sharpMoves = points
    .slice(1)
    .map((point, index) => {
      const previous = points[index].price;
      const percentChange = calculatePercentChange(point.price, previous);
      return {
        date: point.date,
        title: percentChange >= 0 ? "Sharp upward move" : "Sharp downward move",
        description: `${percentChange >= 0 ? "Gain" : "Drop"} of ${Math.abs(
          percentChange
        ).toFixed(2)}% from the prior point`,
        type: "move" as const,
        percentChange,
      };
    })
    .filter((event) => Math.abs(event.percentChange) >= moveThreshold)
    .sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))
    .slice(0, 4);

  return [...corporateEvents, ...sharpMoves]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
}

function firstNonNull(values: Array<number | null>): number | null {
  return values.find((value): value is number => value != null) ?? null;
}

function maxValue(values: number[]): number | null {
  return values.length ? Math.max(...values) : null;
}

function minValue(values: number[]): number | null {
  return values.length ? Math.min(...values) : null;
}

function calculatePercentChange(current: number, base: number): number {
  if (!Number.isFinite(base) || base === 0) return 0;
  return ((current - base) / base) * 100;
}

function getBehavior(percentChange: number | null): "up" | "down" | "flat" {
  if (percentChange == null || Math.abs(percentChange) < 0.01) return "flat";
  return percentChange > 0 ? "up" : "down";
}
