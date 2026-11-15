
import { HumanMessage } from "@langchain/core/messages";
import { getChatModel } from "@/lib/llm";
import { fetchCompanyInfo } from "@/services/companyInfoService";
import { fetchLatestNews } from "@/services/newsService";
import { researchPrompt } from "@/utils/promptTemplates";
import { safeParseJSON } from "@/utils/parseJSON";
import type { AgentState, ResearchOutput } from "./state";

interface ResearchLLMShape {
  industry: string;
  headquarters: string;
  foundedYear: string | null;
  businessModel: string;
  marketPosition: string;
  researchSummary: string;
}

export async function researchAgent(state: AgentState): Promise<Partial<AgentState>> {
  const { companyName } = state;

  try {
    const [companyInfo, news] = await Promise.all([
      fetchCompanyInfo(companyName).catch(() => ({
        title: companyName,
        summary: `No Wikipedia entry found for "${companyName}".`,
        url: null,
        foundedYear: null,
        headquarters: null,
        industry: null,
        employeeCount: null,
      })),
      fetchLatestNews(companyName).catch(() => [])
    ]);

    let parsed: ResearchLLMShape = {
      industry: companyInfo.industry ?? "Corporate",
      headquarters: companyInfo.headquarters ?? "Unknown",
      foundedYear: companyInfo.foundedYear ?? null,
      businessModel: "Global enterprise operations and product delivery.",
      marketPosition: "Significant player in its industry sector.",
      researchSummary: companyInfo.summary || `${companyName} operates in the global markets.`
    };

    try {
      const model  = getChatModel();
      const prompt = researchPrompt({
        companyName,
        wikiSummary:    companyInfo.summary,
        newsHeadlines:  news.map((n) => n.title)
      });

      const response = await model.invoke([new HumanMessage(prompt)]);
      const raw =
        typeof response.content === "string"
          ? response.content
          : JSON.stringify(response.content);

      parsed = safeParseJSON<ResearchLLMShape>(raw, parsed);
    } catch (llmErr: any) {
      console.error("researchAgent LLM invocation error:", llmErr);
    }

    const isUnknown = (v: string | null | undefined) =>
      !v || v === "Unknown" || v === "Not available.";

    const industry =
      !isUnknown(parsed.industry)       ? parsed.industry
      : companyInfo.industry            ?? "Unknown";

    const headquarters =
      !isUnknown(parsed.headquarters)   ? parsed.headquarters
      : companyInfo.headquarters        ?? "Unknown";

    const foundedYear =
      parsed.foundedYear                ?? companyInfo.foundedYear ?? null;

    const research: ResearchOutput = {
      companyName,
      legalSummary:    companyInfo.summary,
      industry,
      headquarters,
      foundedYear,
      employeeCount:   companyInfo.employeeCount ?? null,
      businessModel:   parsed.businessModel,
      marketPosition:  parsed.marketPosition,
      recentNews:      news,
      researchSummary: parsed.researchSummary
    };

    return { research };
  } catch (err: any) {
    console.error("researchAgent critical error:", err);
    return {
      errors: [err?.message ?? "Research agent encountered an error."],
      research: {
        companyName,
        legalSummary: `Information for "${companyName}" is currently limited.`,
        industry: "Corporate",
        headquarters: "Unknown",
        foundedYear: null,
        employeeCount: null,
        businessModel: "Commercial operations.",
        marketPosition: "Active participant in its market domain.",
        recentNews: [],
        researchSummary: `${companyName} profile analysis was completed with baseline context.`
      }
    };
  }
}
