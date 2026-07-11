import { HumanMessage } from "@langchain/core/messages";
import { getChatModel } from "@/lib/llm";
import { riskPrompt } from "@/utils/promptTemplates";
import { safeParseJSON } from "@/utils/parseJSON";
import type { AgentState, RiskOutput } from "./state";

interface RiskLLMShape {
  competitiveRisks: string[];
  marketRisks: string[];
  financialRisks: string[];
  regulatoryOrOtherRisks: string[];
  overallRiskLevel: "Low" | "Medium" | "High";
  riskSummary: string;
}

export async function riskAgent(state: AgentState): Promise<Partial<AgentState>> {
  const { companyName, research, financial } = state;

  if (!research || !financial) {
    return {
      errors: [...state.errors, "Risk Agent skipped: missing research or financial context."]
    };
  }

  const model = getChatModel();
  const prompt = riskPrompt({
    companyName,
    industry: research.industry,
    marketPosition: research.marketPosition,
    financialSummary: financial.financialSummary
  });

  const response = await model.invoke([new HumanMessage(prompt)]);
  const raw = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

  const parsed = safeParseJSON<RiskLLMShape>(raw, {
    competitiveRisks: [],
    marketRisks: [],
    financialRisks: [],
    regulatoryOrOtherRisks: [],
    overallRiskLevel: "Medium",
    riskSummary: "Risk analysis unavailable."
  });

  const risk: RiskOutput = {
    competitiveRisks: parsed.competitiveRisks ?? [],
    marketRisks: parsed.marketRisks ?? [],
    financialRisks: parsed.financialRisks ?? [],
    regulatoryOrOtherRisks: parsed.regulatoryOrOtherRisks ?? [],
    overallRiskLevel: parsed.overallRiskLevel ?? "Medium",
    riskSummary: parsed.riskSummary
  };

  return { risk };
}
