
import { StateGraph, END, START } from "@langchain/langgraph";
import type { AgentState } from "./state";
import { researchAgent } from "./researchAgent";
import { financialAgent } from "./financialAgent";
import { riskAgent } from "./riskAgent";
import { decisionAgent } from "./decisionAgent";

const graphChannels = {
  companyName: {
    value: (_x: string, y: string) => y,
    default: () => ""
  },
  research: {
    value: (x: AgentState["research"], y: AgentState["research"]) => y ?? x,
    default: () => null
  },
  financial: {
    value: (x: AgentState["financial"], y: AgentState["financial"]) => y ?? x,
    default: () => null
  },
  risk: {
    value: (x: AgentState["risk"], y: AgentState["risk"]) => y ?? x,
    default: () => null
  },
  decision: {
    value: (x: AgentState["decision"], y: AgentState["decision"]) => y ?? x,
    default: () => null
  },
  errors: {
    value: (x: string[], y: string[]) => x.concat(y ?? []),
    default: () => []
  }
};

export function buildInvestmentResearchGraph() {
  const workflow = new StateGraph<AgentState>({ channels: graphChannels });

  workflow.addNode("researchNode", researchAgent);
  workflow.addNode("financialNode", financialAgent);
  workflow.addNode("riskNode", riskAgent);
  workflow.addNode("decisionNode", decisionAgent);

  workflow.addEdge(START, "researchNode" as any);
  workflow.addEdge("researchNode" as any, "financialNode" as any);
  workflow.addEdge("financialNode" as any, "riskNode" as any);
  workflow.addEdge("riskNode" as any, "decisionNode" as any);
  workflow.addEdge("decisionNode" as any, END);

  return workflow.compile();
}
