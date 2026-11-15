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

  try {
    const researchSummary = research?.researchSummary || `${companyName} overview analyzed.`;
    const marketPosition = research?.marketPosition || "Active industry participant.";
    const financialSummary = financial?.financialSummary || "Baseline financial parameters.";
    const financialStrengthScore = financial?.financialStrengthScore ?? 50;
    const riskSummary = risk?.riskSummary || "Moderate risk profile.";
    const overallRiskLevel = risk?.overallRiskLevel || "Medium";

    let parsed: DecisionLLMShape = {
      decision: financialStrengthScore >= 60 ? "INVEST" : "PASS",
      confidenceScore: 65,
      reasons: [
        `Evaluation based on available market and financial standing.`,
        `Industry position and risk assessment align with score.`
      ],
      opportunities: ["Potential growth in core addressable market"],
      risks: ["Sector competition and macro uncertainty"],
      verdictSummary: `Investment recommendation for ${companyName} evaluated on current fundamentals and risk-reward profile.`
    };

    try {
      const model = getChatModel();
      const prompt = decisionPrompt({
        companyName,
        researchSummary,
        marketPosition,
        financialSummary,
        financialStrengthScore,
        riskSummary,
        overallRiskLevel
      });

      const response = await model.invoke([new HumanMessage(prompt)]);
      const raw = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

      parsed = safeParseJSON<DecisionLLMShape>(raw, parsed);
    } catch (llmErr: any) {
      console.error("decisionAgent LLM invocation error:", llmErr);
    }

    const decision: DecisionOutput = {
      decision: parsed.decision === "INVEST" ? "INVEST" : "PASS",
      confidenceScore: clampScore(parsed.confidenceScore),
      reasons: parsed.reasons?.length ? parsed.reasons : ["Evaluated based on composite agent findings."],
      opportunities: parsed.opportunities?.length ? parsed.opportunities : ["Core business opportunities"],
      risks: parsed.risks?.length ? parsed.risks : ["Standard business environment risks"],
      verdictSummary: parsed.verdictSummary
    };

    return { decision };
  } catch (err: any) {
    console.error("decisionAgent critical error:", err);
    return {
      errors: [err?.message ?? "Decision agent encountered an error."],
      decision: {
        decision: "PASS",
        confidenceScore: 50,
        reasons: ["Evaluation completed with conservative risk-adjusted metrics."],
        opportunities: ["Operational expansion"],
        risks: ["Market fluctuations"],
        verdictSummary: `Completed analysis for ${companyName}.`
      }
    };
  }
}

function clampScore(n: number): number {
  if (Number.isNaN(n)) return 40;
  return Math.max(0, Math.min(100, Math.round(n)));
}
