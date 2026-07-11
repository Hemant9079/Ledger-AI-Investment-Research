
export interface ResearchOutput {
  companyName: string;
  legalSummary: string;
  industry: string;
  headquarters: string;
  foundedYear: string | null;
  employeeCount: number | null;
  businessModel: string;
  marketPosition: string;
  recentNews: { title: string; source: string; url: string; publishedAt: string }[];
  researchSummary: string;
}

export interface FinancialOutput {
  tickerSymbol: string | null;
  isPublic: boolean;
  currency: string | null;
  currentPrice: number | null;
  marketCap: number | null;
  peRatio: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  revenueTrend: string | null;
  financialSummary: string;
  financialStrengthScore: number;
  sector: string | null;
  industry: string | null;
  country: string | null;
  city: string | null;
  fullTimeEmployees: number | null;
  longBusinessSummary: string | null;
  totalCapitalization: number | null;
}

export interface RiskOutput {
  competitiveRisks: string[];
  marketRisks: string[];
  financialRisks: string[];
  regulatoryOrOtherRisks: string[];
  overallRiskLevel: "Low" | "Medium" | "High";
  riskSummary: string;
}

export interface DecisionOutput {
  decision: "INVEST" | "PASS";
  confidenceScore: number;
  reasons: string[];
  opportunities: string[];
  risks: string[];
  verdictSummary: string;
}

export interface AgentState {
  companyName: string;
  research: ResearchOutput | null;
  financial: FinancialOutput | null;
  risk: RiskOutput | null;
  decision: DecisionOutput | null;
  errors: string[];
}

export function createInitialState(companyName: string): AgentState {
  return {
    companyName,
    research: null,
    financial: null,
    risk: null,
    decision: null,
    errors: []
  };
}
