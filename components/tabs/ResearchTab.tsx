"use client";

import { motion } from "framer-motion";
import type { ResearchOutput, FinancialOutput, DecisionOutput } from "@/agents/state";
import CompanyOverviewCard from "@/components/CompanyOverviewCard";
import ResearchSummaryCard from "@/components/ResearchSummaryCard";
import StockPerformanceGraph from "@/components/StockPerformanceGraph";
import ConfidenceGauge from "@/components/ConfidenceGauge";

interface Props {
  research: ResearchOutput;
  financial: FinancialOutput | null;
  decision: DecisionOutput | null;
}

export default function ResearchTab({ research, financial, decision }: Props) {
  const isInvest = decision?.decision === "INVEST";
  const accentColor = isInvest ? "#10B981" : "#EF4444";
  const accentBg = isInvest ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)";
  const accentBorder = isInvest ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";
  const accentGlow = isInvest ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div
          className="flex items-center justify-between rounded-xl px-5 py-3"
          
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest" >
              [R] Research Agent
            </span>
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
              
            >
              ● Active
            </span>
          </div>
          <span className="font-mono text-[10px]" >
            {new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })} UTC
          </span>
        </div>

        <CompanyOverviewCard research={research} financial={financial} />

        <ResearchSummaryCard research={research} />

        {financial?.isPublic && financial.tickerSymbol && (
          <StockPerformanceGraph symbol={financial.tickerSymbol} />
        )}

        <div className="card p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="label-eyebrow">Market Position Analysis</span>
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[10px]"
              
            >
              AI GENERATED
            </span>
          </div>
          <p className="text-sm leading-7" >
            {research.marketPosition}
          </p>
          <div
            className="mt-4 grid grid-cols-1 gap-3 rounded-xl p-4 sm:grid-cols-3"
            
          >
            <InfoPill label="Industry" value={research.industry} />
            <InfoPill label="HQ" value={research.headquarters} />
            <InfoPill label="Business Model" value={research.businessModel.slice(0, 60) + "…"} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        {decision ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className=" sticky top-6 overflow-hidden rounded-2xl p-6"
            style={{
              background: accentBg,
              border: `2px solid ${accentBorder}`,
              backdropFilter: "blur(24px)",
              boxShadow: `0 0 60px ${accentGlow}, 0 24px 60px rgba(0,0,0,0.5)`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            />

            <span className="label-eyebrow" style={{ color: `${accentColor}80` }}>
              AI Verdict
            </span>

            <div className="mt-5 flex flex-col items-center">
              <div
                className="rounded-2xl px-10 py-4 text-4xl font-bold tracking-widest"
                style={{
                  border: `1px solid ${accentBorder}`,
                  background: accentBg,
                  color: accentColor,
                  boxShadow: `0 0 40px ${accentGlow}`,
                  fontFamily: "var(--font-jbmono)",
                }}
              >
                {decision.decision}
              </div>
              <ConfidenceGauge score={decision.confidenceScore} color={accentColor} />
            </div>

            <p
              className="mt-4 rounded-xl p-4 text-center text-sm leading-7"
              
            >
              {decision.verdictSummary}
            </p>

            <VerdictList title="✓ Strengths" items={decision.reasons} color="#10B981" />
            <VerdictList title="↑ Opportunities" items={decision.opportunities} color="#34D399" />
            <VerdictList title="! Key Risks" items={decision.risks} color="#EF4444" />

            <button
              className="btn-neon mt-6 w-full rounded-xl py-3 font-mono text-xs font-bold tracking-widest"
            >
              Execute Investment Plan
            </button>
          </motion.div>
        ) : (
          <div className="card flex h-40 items-center justify-center p-6">
            <p className="font-mono text-sm" >
              Decision pending…
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider" >
        {label}
      </div>
      <div className="text-xs font-medium" >
        {value}
      </div>
    </div>
  );
}

function VerdictList({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items?.length) return null;
  return (
    <div className="mt-5">
      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: `${color}80` }}>
        {title}
      </span>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-xl p-3 text-sm"
            
          >
            <span className="mt-0.5 shrink-0 font-mono text-xs font-bold" style={{ color }}>
              →
            </span>
            <span className="leading-6" >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
