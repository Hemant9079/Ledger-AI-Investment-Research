export function researchPrompt(params: {
  companyName: string;
  wikiSummary: string;
  newsHeadlines: string[];
}) {
  const { companyName, wikiSummary, newsHeadlines } = params;
  return `You are a Research Analyst AI. Analyze the company "${companyName}" using the context below.

WIKIPEDIA CONTEXT:
${wikiSummary}

RECENT NEWS HEADLINES:
${newsHeadlines.map((h, i) => `${i + 1}. ${h}`).join("\n") || "No recent headlines found."}

INSTRUCTIONS:
- Extract "industry", "headquarters", and "foundedYear" directly from the Wikipedia text above. Do NOT return "Unknown" if the Wikipedia text mentions the industry, country, city, or founding year — read carefully.
- For "headquarters", provide the city and country (e.g. "Bengaluru, India" or "Cupertino, USA").
- For "foundedYear", return just the 4-digit year as a string (e.g. "1981"), or null if truly not mentioned.
- For "industry", use the sector name from Wikipedia (e.g. "Information Technology", "Automotive", "Financial Services").
- Write "businessModel" and "marketPosition" using your own knowledge if not in the Wikipedia text.

Return ONLY valid JSON (no markdown fences, no commentary) matching this exact shape:
{
  "industry": string,
  "headquarters": string,
  "foundedYear": string | null,
  "businessModel": string (2-3 sentences on how the company makes money),
  "marketPosition": string (2-3 sentences: market share, competitive standing, leadership position),
  "researchSummary": string (4-6 sentence narrative overview a busy investor would read first)
}`;
}

export function financialPrompt(params: {
  companyName: string;
  isPublic: boolean;
  tickerSymbol: string | null;
  currentPrice: number | null;
  marketCap: number | null;
  peRatio: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  currency: string | null;
}) {
  const p = params;
  return `You are a Financial Analysis Agent. Analyze the financial standing of "${p.companyName}".

MARKET DATA (from Yahoo Finance, may be partial if the company is private):
- Publicly traded: ${p.isPublic}
- Ticker: ${p.tickerSymbol ?? "N/A"}
- Current price: ${p.currentPrice ?? "N/A"} ${p.currency ?? ""}
- Market cap: ${p.marketCap ?? "N/A"}
- P/E ratio: ${p.peRatio ?? "N/A"}
- 52-week high: ${p.fiftyTwoWeekHigh ?? "N/A"}
- 52-week low: ${p.fiftyTwoWeekLow ?? "N/A"}

If market data is "N/A" (private company or data unavailable), reason qualitatively using your own knowledge of the company's funding, revenue model, and financial reputation instead of inventing numbers.

Return ONLY valid JSON matching this shape:
{
  "revenueTrend": string (one sentence: growing / declining / stable, with why),
  "financialSummary": string (4-6 sentence narrative: revenue, growth, valuation, financial health),
  "financialStrengthScore": number (0-100, your estimate of overall financial strength)
}`;
}

export function riskPrompt(params: {
  companyName: string;
  industry: string;
  marketPosition: string;
  financialSummary: string;
}) {
  const p = params;
  return `You are a Risk Analysis Agent. Identify the key risks facing "${p.companyName}", a company in the "${p.industry}" industry.

CONTEXT FROM OTHER AGENTS:
Market position: ${p.marketPosition}
Financial summary: ${p.financialSummary}

Return ONLY valid JSON matching this shape:
{
  "competitiveRisks": string[] (2-4 bullet points on competitors/market share threats),
  "marketRisks": string[] (2-4 bullet points on market/industry/macro risks),
  "financialRisks": string[] (2-4 bullet points on balance sheet, valuation, or cash flow risks),
  "regulatoryOrOtherRisks": string[] (1-3 bullet points on legal, regulatory, or reputational risks),
  "overallRiskLevel": "Low" | "Medium" | "High",
  "riskSummary": string (3-5 sentence narrative synthesis)
}`;
}

export function decisionPrompt(params: {
  companyName: string;
  researchSummary: string;
  marketPosition: string;
  financialSummary: string;
  financialStrengthScore: number;
  riskSummary: string;
  overallRiskLevel: string;
}) {
  const p = params;
  return `You are the Decision Agent — the final, most senior voice on an AI investment committee analyzing "${p.companyName}". You have been handed reports from three specialist agents. Weigh them and produce a final call.

RESEARCH AGENT REPORT:
${p.researchSummary}
Market position: ${p.marketPosition}

FINANCIAL AGENT REPORT (financial strength score: ${p.financialStrengthScore}/100):
${p.financialSummary}

RISK AGENT REPORT (overall risk level: ${p.overallRiskLevel}):
${p.riskSummary}

Weigh growth potential, financial strength, and risk level together. Be decisive and be honest — do not default to "INVEST" just to be agreeable; a well-reasoned "PASS" is just as valuable an output as "INVEST".

Return ONLY valid JSON matching this shape:
{
  "decision": "INVEST" | "PASS",
  "confidenceScore": number (0-100, how confident you are in this decision),
  "reasons": string[] (3-5 bullet points explaining the decision),
  "opportunities": string[] (2-4 bullet points on upside potential),
  "risks": string[] (2-4 bullet points on the biggest downside risks),
  "verdictSummary": string (2-3 sentence executive summary of the final call)
}`;
}
