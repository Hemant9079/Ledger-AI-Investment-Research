import { HumanMessage } from "@langchain/core/messages";
import { getChatModel } from "@/lib/llm";
import { decisionPrompt } from "@/utils/promptTemplates";
import { safeParseJSON } from "@/utils/parseJSON";
import type { AgentState, DecisionOutput } from "./state";

interface DecisionLLMShape {
  decision: "INVEST" | "PASS";
  confidenceScore: number;
  reasons: string[];
  opportunities: string[];
  risks: string[];
  verdictSummary: string;
}

export async function decisionAgent(state: AgentState): Promise<Partial<AgentState>> {
  const { companyName, research, financial, risk } = state;

  if (!research || !financial || !risk) {
    return {
      errors: [...state.errors, "Decision Agent skipped: incomplete upstream data."],
      decision: {
        decision: "PASS",
        confidenceScore: 0,
        reasons: ["Insufficient data to make a confident decision."],
        opportunities: [],
        risks: ["Upstream research, financial, or risk analysis failed."],
        verdictSummary: "Unable to reach a verdict due to missing analysis."
      }
    };
  }

  const model = getChatModel();
  const prompt = decisionPrompt({
    companyName,
    researchSummary: research.researchSummary,
    marketPosition: research.marketPosition,
    financialSummary: financial.financialSummary,
    financialStrengthScore: financial.financialStrengthScore,
    riskSummary: risk.riskSummary,
    overallRiskLevel: risk.overallRiskLevel
  });

  const response = await model.invoke([new HumanMessage(prompt)]);
  const raw = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

  const parsed = safeParseJSON<DecisionLLMShape>(raw, {
    decision: "PASS",
    confidenceScore: 40,
    reasons: ["Decision Agent could not parse a structured response."],
    opportunities: [],
    risks: ["LLM output parsing failed."],
    verdictSummary: "Defaulting to a cautious PASS due to a parsing error."
  });

  const decision: DecisionOutput = {
    decision: parsed.decision === "INVEST" ? "INVEST" : "PASS",
    confidenceScore: clampScore(parsed.confidenceScore),
    reasons: parsed.reasons ?? [],
    opportunities: parsed.opportunities ?? [],
    risks: parsed.risks ?? [],
    verdictSummary: parsed.verdictSummary
  };

  return { decision };
}

function clampScore(n: number): number {
  if (Number.isNaN(n)) return 40;
  return Math.max(0, Math.min(100, Math.round(n)));
}
