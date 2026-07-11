
import { HumanMessage } from "@langchain/core/messages";
import { getChatModel } from "@/lib/llm";
import { fetchCompanyInfo } from "@/services/companyInfoService";
import { fetchLatestNews } from "@/services/newsService";
import { fetchFinancialSnapshot } from "@/services/financialService";
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

  const [companyInfo, news, snapshot] = await Promise.all([
    fetchCompanyInfo(companyName),
    fetchLatestNews(companyName),
    fetchFinancialSnapshot(companyName)
  ]);

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

  const parsed = safeParseJSON<ResearchLLMShape>(raw, {
    industry:        "Unknown",
    headquarters:    "Unknown",
    foundedYear:     null,
    businessModel:   "Not available.",
    marketPosition:  "Not available.",
    researchSummary: companyInfo.summary || "No research summary available."
  });

  const isUnknown = (v: string | null | undefined) =>
    !v || v === "Unknown" || v === "Not available.";

  const industry =
    !isUnknown(parsed.industry)       ? parsed.industry
    : companyInfo.industry            ? companyInfo.industry
    : snapshot.industry               ?? "Unknown";

  const headquarters =
    !isUnknown(parsed.headquarters)   ? parsed.headquarters
    : companyInfo.headquarters        ? companyInfo.headquarters
    : snapshot.city && snapshot.country
      ? `${snapshot.city}, ${snapshot.country}`
    : snapshot.country                ?? "Unknown";

  const foundedYear =
    parsed.foundedYear                ?? companyInfo.foundedYear ?? null;

  const research: ResearchOutput = {
    companyName,
    legalSummary:    companyInfo.summary,
    industry,
    headquarters,
    foundedYear,
    employeeCount:   companyInfo.employeeCount ?? snapshot.fullTimeEmployees ?? null,
    businessModel:   parsed.businessModel,
    marketPosition:  parsed.marketPosition,
    recentNews:      news,
    researchSummary: parsed.researchSummary
  };

  return { research };
}
