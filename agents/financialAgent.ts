
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

  const snapshot = await fetchFinancialSnapshot(companyName);

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

  const parsed = safeParseJSON<FinancialLLMShape>(raw, {
    revenueTrend: "Unknown",
    financialSummary: "Financial data unavailable.",
    financialStrengthScore: 50
  });

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
}

function clampScore(n: number): number {
  if (Number.isNaN(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}
