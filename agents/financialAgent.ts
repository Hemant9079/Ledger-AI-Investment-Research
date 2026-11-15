
import { HumanMessage } from "@langchain/core/messages";
import { getChatModel } from "@/lib/llm";
import { fetchFinancialSnapshot } from "@/services/financialService";
import { financialPrompt } from "@/utils/promptTemplates";
import { safeParseJSON } from "@/utils/parseJSON";
import type { AgentState, FinancialOutput } from "./state";

interface FinancialLLMShape {
  revenueTrend: string;
  financialSummary: string;
  financialStrengthScore: number;
}

export async function financialAgent(state: AgentState): Promise<Partial<AgentState>> {
  const { companyName } = state;

  try {
    const snapshot = await fetchFinancialSnapshot(companyName).catch(() => ({
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
      totalCapitalization: null,
    }));

    let parsed: FinancialLLMShape = {
      revenueTrend: snapshot.isPublic ? "Stable / market-aligned" : "Qualitative operational growth",
      financialSummary: snapshot.isPublic && snapshot.currentPrice != null
        ? `${companyName} trades at ${snapshot.currentPrice} ${snapshot.currency ?? ""} with a market capitalization of ${snapshot.marketCap ? snapshot.marketCap.toLocaleString() : "N/A"}.`
        : `Financial data for ${companyName} is analyzed on operational fundamentals.`,
      financialStrengthScore: snapshot.isPublic ? 65 : 55
    };

    try {
      const model = getChatModel();
      const prompt = financialPrompt({
        companyName,
        isPublic: snapshot.isPublic,
        tickerSymbol: snapshot.tickerSymbol,
        currentPrice: snapshot.currentPrice,
        marketCap: snapshot.marketCap,
        peRatio: snapshot.peRatio,
        fiftyTwoWeekHigh: snapshot.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: snapshot.fiftyTwoWeekLow,
        currency: snapshot.currency
      });

      const response = await model.invoke([new HumanMessage(prompt)]);
      const raw = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

      parsed = safeParseJSON<FinancialLLMShape>(raw, parsed);
    } catch (llmErr: any) {
      console.error("financialAgent LLM invocation error:", llmErr);
    }

    const financial: FinancialOutput = {
      tickerSymbol: snapshot.tickerSymbol,
      isPublic: snapshot.isPublic,
      currency: snapshot.currency,
      currentPrice: snapshot.currentPrice,
      marketCap: snapshot.marketCap,
      peRatio: snapshot.peRatio,
      fiftyTwoWeekHigh: snapshot.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: snapshot.fiftyTwoWeekLow,
      revenueTrend: parsed.revenueTrend,
      financialSummary: parsed.financialSummary,
      financialStrengthScore: clampScore(parsed.financialStrengthScore),
      sector: snapshot.sector,
      industry: snapshot.industry,
      country: snapshot.country,
      city: snapshot.city,
      fullTimeEmployees: snapshot.fullTimeEmployees,
      longBusinessSummary: snapshot.longBusinessSummary,
      totalCapitalization: snapshot.totalCapitalization
    };

    return { financial };
  } catch (err: any) {
    console.error("financialAgent critical error:", err);
    return {
      errors: [err?.message ?? "Financial agent encountered an error."],
      financial: {
        tickerSymbol: null,
        isPublic: false,
        currency: "USD",
        currentPrice: null,
        marketCap: null,
        peRatio: null,
        fiftyTwoWeekHigh: null,
        fiftyTwoWeekLow: null,
        revenueTrend: "Steady operational foundation",
        financialSummary: `Financial evaluation completed with general fundamental metrics for ${companyName}.`,
        financialStrengthScore: 50,
        sector: null,
        industry: null,
        country: null,
        city: null,
        fullTimeEmployees: null,
        longBusinessSummary: null,
        totalCapitalization: null
      }
    };
  }
}

function clampScore(n: number): number {
  if (Number.isNaN(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}
