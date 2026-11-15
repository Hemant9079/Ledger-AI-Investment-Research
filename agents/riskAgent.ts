import { HumanMessage } from "@langchain/core/messages";
import { invokeModelWithTimeout } from "@/lib/llm";
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

  try {
    const industry = research?.industry || "Technology & Services";
    const marketPosition = research?.marketPosition || "Market participant";
    const financialSummary = financial?.financialSummary || "Moderate financial profile";

    let parsed: RiskLLMShape = {
      competitiveRisks: ["Intense sector competition", "Rapid technological shifts"],
      marketRisks: ["Macroeconomic headwinds", "Market demand fluctuations"],
      financialRisks: ["Capital expenditure requirements", "Margin pressures"],
      regulatoryOrOtherRisks: ["Regulatory compliance evolution", "Geopolitical risks"],
      overallRiskLevel: "Medium",
      riskSummary: `Risk evaluation for ${companyName} highlights standard sector risks alongside operational market considerations.`
    };

    try {
      const prompt = riskPrompt({
        companyName,
        industry,
        marketPosition,
        financialSummary
      });

      const response = await invokeModelWithTimeout([new HumanMessage(prompt)], 6000);
      const raw = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

      parsed = safeParseJSON<RiskLLMShape>(raw, parsed);
    } catch (llmErr: any) {
      console.error("riskAgent LLM invocation error:", llmErr);
    }

    const risk: RiskOutput = {
      competitiveRisks: parsed.competitiveRisks?.length ? parsed.competitiveRisks : ["Market rivalry in sector"],
      marketRisks: parsed.marketRisks?.length ? parsed.marketRisks : ["Macroeconomic volatility"],
      financialRisks: parsed.financialRisks?.length ? parsed.financialRisks : ["Cost structure and margin pressures"],
      regulatoryOrOtherRisks: parsed.regulatoryOrOtherRisks?.length ? parsed.regulatoryOrOtherRisks : ["Standard regulatory oversight"],
      overallRiskLevel: parsed.overallRiskLevel ?? "Medium",
      riskSummary: parsed.riskSummary
    };

    return { risk };
  } catch (err: any) {
    console.error("riskAgent critical error:", err);
    return {
      errors: [err?.message ?? "Risk agent encountered an error."],
      risk: {
        competitiveRisks: ["Industry competitive landscape"],
        marketRisks: ["Broad market cycle exposure"],
        financialRisks: ["Operational cost balance"],
        regulatoryOrOtherRisks: ["Regulatory and compliance frameworks"],
        overallRiskLevel: "Medium",
        riskSummary: `Baseline risk profile generated for ${companyName}.`
      }
    };
  }
}
