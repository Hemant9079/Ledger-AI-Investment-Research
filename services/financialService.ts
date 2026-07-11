
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export interface FinancialSnapshot {
  tickerSymbol: string | null;
  isPublic: boolean;
  currency: string | null;
  currentPrice: number | null;
  marketCap: number | null;
  peRatio: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  longName: string | null;
  sector: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  fullTimeEmployees: number | null;
  longBusinessSummary: string | null;
  totalCapitalization: number | null;
}

export async function fetchFinancialSnapshot(
  companyName: string
): Promise<FinancialSnapshot> {
  try {
    const searchResults = await yahooFinance.search(companyName, {
      quotesCount: 1,
      newsCount: 0
    });

    const bestMatch = searchResults.quotes?.[0] as any;
    const symbol: string | undefined = bestMatch?.symbol;

    if (!symbol) return emptySnapshot();

    const [quoteResult, summaryResult] = await Promise.allSettled([
      yahooFinance.quote(symbol),
      yahooFinance.quoteSummary(symbol, {
        modules: ["assetProfile", "defaultKeyStatistics"]
      })
    ]);

    const q = quoteResult.status === "fulfilled" ? quoteResult.value : null;
    const profile =
      summaryResult.status === "fulfilled"
        ? (summaryResult.value as any)?.assetProfile
        : null;
    const keyStats =
      summaryResult.status === "fulfilled"
        ? (summaryResult.value as any)?.defaultKeyStatistics
        : null;

    return {
      tickerSymbol: symbol,
      isPublic: true,
      currency: q?.currency ?? null,
      currentPrice: q?.regularMarketPrice ?? null,
      marketCap: q?.marketCap ?? null,
      peRatio: q?.trailingPE ?? null,
      fiftyTwoWeekHigh: q?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: q?.fiftyTwoWeekLow ?? null,
      longName: q?.longName ?? q?.shortName ?? null,
      sector: profile?.sector ?? null,
      industry: profile?.industry ?? null,
      country: profile?.country ?? null,
      city: profile?.city ?? null,
      fullTimeEmployees: profile?.fullTimeEmployees ?? null,
      longBusinessSummary: profile?.longBusinessSummary ?? null,
      totalCapitalization: keyStats?.enterpriseValue ?? q?.marketCap ?? null
    };
  } catch (err) {
    console.error("financialService error:", err);
    return emptySnapshot();
  }
}

function emptySnapshot(): FinancialSnapshot {
  return {
    tickerSymbol: null,
    isPublic: false,
    currency: null,
    currentPrice: null,
    marketCap: null,
    peRatio: null,
    fiftyTwoWeekHigh: null,
    fiftyTwoWeekLow: null,
    longName: null,
    sector: null,
    industry: null,
    country: null,
    city: null,
    fullTimeEmployees: null,
    longBusinessSummary: null,
    totalCapitalization: null
  };
}
