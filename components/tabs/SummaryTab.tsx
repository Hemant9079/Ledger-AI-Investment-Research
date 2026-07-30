"use client";

import { motion } from "framer-motion";
import type { AgentState } from "@/agents/state";
import CompanyOverviewCard from "@/components/CompanyOverviewCard";
import ResearchSummaryCard from "@/components/ResearchSummaryCard";
import FinancialAnalysisCard from "@/components/FinancialAnalysisCard";
import RiskAnalysisCard from "@/components/RiskAnalysisCard";
import DecisionCard from "@/components/DecisionCard";
import StockPerformanceGraph from "@/components/StockPerformanceGraph";

interface Props {
  data: AgentState;
}

export default function SummaryTab({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div
        className="mb-6 flex items-center gap-4 rounded-xl px-5 py-3"
        
      >
        <span className="label-eyebrow">Full Research Report</span>
        <span
          className="rounded-full px-2.5 py-1 font-mono text-[10px]"
          
        >
          4 Agents · Consolidated View
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {data.research && (
            <CompanyOverviewCard research={data.research} financial={data.financial} />
          )}
          {data.research && <ResearchSummaryCard research={data.research} />}
          {data.financial?.isPublic && data.financial.tickerSymbol && (
            <StockPerformanceGraph symbol={data.financial.tickerSymbol} />
          )}
          {data.financial && <FinancialAnalysisCard financial={data.financial} />}
          {data.risk && <RiskAnalysisCard risk={data.risk} />}
        </div>

        <div className="lg:col-span-1">
          {data.decision && <DecisionCard decision={data.decision} />}
        </div>
      </div>
    </motion.div>
  );
}
