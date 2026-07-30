"use client";

import { motion } from "framer-motion";
import type { DecisionOutput, ResearchOutput, FinancialOutput, RiskOutput } from "@/agents/state";

interface Props {
  decision: DecisionOutput;
  research: ResearchOutput | null;
  financial: FinancialOutput | null;
  risk: RiskOutput | null;
}

export default function DecisionTab({ decision, research, financial, risk }: Props) {
  const isInvest = decision.decision === "INVEST";
  const accentColor = isInvest ? "#10B981" : "#EF4444";
  const accentBg = isInvest ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)";
  const accentBorder = isInvest ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";
  const accentGlow = isInvest ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)";
  const verdictLabel = isInvest ? "STRATEGIC BUY" : "STRATEGIC PASS";

  const agentConsensus = [
    {
      agent: "Research Agent",
      sub: "Sentiment & News Aggregate",
      verdict: isInvest ? "BULLISH" : "BEARISH",
      color: isInvest ? "#10B981" : "#EF4444",
      icon: "[R]",
    },
    {
      agent: "Financial Agent",
      sub: "Fundamentals & Liquidity",
      verdict: (financial?.financialStrengthScore ?? 0) >= 70 ? "OPTIMAL" : (financial?.financialStrengthScore ?? 0) >= 45 ? "NEUTRAL" : "WEAK",
      color: (financial?.financialStrengthScore ?? 0) >= 70 ? "#10B981" : (financial?.financialStrengthScore ?? 0) >= 45 ? "#F59E0B" : "#EF4444",
      icon: "[F]",
    },
    {
      agent: "Risk Agent",
      sub: "Exposure & Volatility Analysis",
      verdict: risk?.overallRiskLevel === "Low" ? "LOW RISK" : risk?.overallRiskLevel === "Medium" ? "MODERATE" : "HIGH RISK",
      color: risk?.overallRiskLevel === "Low" ? "#10B981" : risk?.overallRiskLevel === "Medium" ? "#F59E0B" : "#EF4444",
      icon: "[!]",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-3"
          
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest" >
              Decision Agent
            </span>
            <span className="font-mono text-[10px]" >
              · 4 Nodes Active
            </span>
          </div>
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest"
            style={{ background: accentBg, border: `1px solid ${accentBorder}`, color: accentColor }}
          >
            ● {isInvest ? "Strong Positive" : "Strong Negative"}
          </span>
        </div>

        <div
          className="card  relative overflow-hidden p-8"
          style={{ border: `2px solid ${accentBorder}`, boxShadow: `0 0 80px ${accentGlow}` }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
          />
          <div className="mb-3 flex items-center gap-2">
            <span className="label-eyebrow" style={{ color: `${accentColor}80` }}>
              Final Verdict · TSR_PRI_ALPHA
            </span>
          </div>

          <h2 className="text-5xl font-bold tracking-wide md:text-6xl" style={{ fontFamily: "var(--font-jbmono)" }}>
            <span >STRATEGIC </span>
            <span style={{ color: accentColor, textShadow: `0 0 40px ${accentColor}` }}>
              {isInvest ? "BUY" : "PASS"}
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7" >
            {decision.verdictSummary}
          </p>

          <div className="mt-6 flex flex-wrap gap-6">
            <StatPill label="Confidence" value={`${decision.confidenceScore}%`} color={accentColor} />
            <StatPill label="Analysis Depth" value="4 Agents" color="#34D399" />
            <StatPill label="Verdict" value={decision.decision} color={accentColor} />
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="label-eyebrow">Agent Consensus Matrix</span>
            <span className="font-mono text-[10px]" >
              SYNCED {new Date().toLocaleTimeString("en-US", { hour12: false })} AGO
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {agentConsensus.map((agent) => (
              <div
                key={agent.agent}
                className="flex items-center justify-between rounded-xl p-4"
                
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                    
                  >
                    {agent.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" >
                      {agent.agent}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-wider" >
                      {agent.sub}
                    </div>
                  </div>
                </div>
                <span
                  className="font-mono text-sm font-bold tracking-widest"
                  style={{ color: agent.color, textShadow: `0 0 20px ${agent.color}` }}
                >
                  {agent.verdict}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <span className="label-eyebrow" >
              Macro Rationale
            </span>
            <ol className="mt-4 flex flex-col gap-3">
              {decision.reasons.map((reason, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold"
                    
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-6" >
                    {reason}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-6">
            <span className="label-eyebrow" >
              Risk Mitigation
            </span>
            <ol className="mt-4 flex flex-col gap-3">
              {decision.risks.map((risk, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold"
                    
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-6" >
                    {risk}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {decision.opportunities.length > 0 && (
          <div className="card p-6">
            <span className="label-eyebrow" >
              ↑ Growth Opportunities
            </span>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {decision.opportunities.map((opp, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl p-4 text-sm"
                  
                >
                  <span className="mt-0.5 shrink-0 font-bold" >↑</span>
                  <span className="leading-6" >{opp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            className="flex items-center gap-2 rounded-xl px-5 py-3 font-mono text-xs font-bold tracking-widest transition-all"
            
          >
            ↓ Export Verdict Report
          </button>
          <button className="btn-neon flex items-center gap-2 rounded-xl px-6 py-3 font-mono text-xs font-bold tracking-widest">
            Execute Strategic Order
          </button>
        </div>
      </div>

      <div className="lg:col-span-1">
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
            Confidence Score
          </span>

          <div className="mt-5 flex flex-col items-center">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              <circle
                cx="80" cy="80" r="65"
                fill="none"
                stroke={accentColor}
                strokeWidth="12"
                strokeDasharray={`${(decision.confidenceScore / 100) * 408} 408`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ filter: `drop-shadow(0 0 12px ${accentColor})`, transition: "stroke-dasharray 1s ease" }}
              />
              <text x="80" y="72" textAnchor="middle" fill={accentColor} fontSize="36" fontWeight="800" fontFamily="monospace">
                {decision.confidenceScore}
              </text>
              <text x="80" y="92" textAnchor="middle" fill="rgba(156,163,175,0.6)" fontSize="11" fontFamily="monospace">
                CONFIDENCE %
              </text>
            </svg>

            <span
              className="mt-3 rounded-full px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest"
              style={{ background: accentBg, border: `1px solid ${accentBorder}`, color: accentColor }}
            >
              {isInvest ? "↑ Strong Positive" : "↓ Strong Negative"}
            </span>
          </div>

          <p
            className="mt-5 rounded-xl p-4 text-center text-xs leading-6"
            
          >
            {decision.verdictSummary.slice(0, 180)}…
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniStat label="Strengths" value={decision.reasons.length} color="#10B981" />
            <MiniStat label="Risks" value={decision.risks.length} color="#EF4444" />
            <MiniStat label="Opportunities" value={decision.opportunities.length} color="#34D399" />
            <MiniStat label="Agents" value={3} color="#A78BFA" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[10px] uppercase tracking-wider" >
        {label}
      </span>
      <span className="mt-1 font-mono text-xl font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      
    >
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider" >
        {label}
      </div>
    </div>
  );
}
