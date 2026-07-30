"use client";

import { motion } from "framer-motion";
import type { RiskOutput, ResearchOutput } from "@/agents/state";

interface Props {
  risk: RiskOutput;
  research: ResearchOutput | null;
}

const HEATMAP_CONFIG = [
  { key: "market", label: "Market", items: [] as string[], level: "" },
  { key: "regulatory", label: "Regulatory", items: [] as string[], level: "" },
  { key: "financial", label: "Financial", items: [] as string[], level: "" },
  { key: "competitive", label: "Competitive", items: [] as string[], level: "" },
];

function getRiskLevel(count: number): { level: string; color: string; bg: string; border: string } {
  if (count === 0) return { level: "STABLE", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" };
  if (count === 1) return { level: "LOW", color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)" };
  if (count === 2) return { level: "MODERATE", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" };
  if (count === 3) return { level: "HIGH", color: "#F97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)" };
  return { level: "CRITICAL", color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" };
}

const OVERALL_COLOR: Record<RiskOutput["overallRiskLevel"], { color: string; bg: string; border: string; glow: string }> = {
  Low:    { color: "#10B981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.3)",  glow: "rgba(16,185,129,0.2)"  },
  Medium: { color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.3)",  glow: "rgba(245,158,11,0.2)"  },
  High:   { color: "#EF4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)",   glow: "rgba(239,68,68,0.2)"   },
};

export default function RiskTab({ risk, research }: Props) {
  const oc = OVERALL_COLOR[risk.overallRiskLevel];

  const heatmaps = [
    { label: "Market",       items: risk.marketRisks,             ...getRiskLevel(risk.marketRisks.length) },
    { label: "Regulatory",   items: risk.regulatoryOrOtherRisks,  ...getRiskLevel(risk.regulatoryOrOtherRisks.length) },
    { label: "Financial",    items: risk.financialRisks,          ...getRiskLevel(risk.financialRisks.length) },
    { label: "Competitive",  items: risk.competitiveRisks,        ...getRiskLevel(risk.competitiveRisks.length) },
  ];

  const riskScore = risk.overallRiskLevel === "Low" ? 28 : risk.overallRiskLevel === "Medium" ? 58 : 82;

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
              [!] Risk Agent Node
            </span>
            <span className="font-mono text-[10px]" >
              · Scanning Regulatory Filters
            </span>
          </div>
          <span className="font-mono text-[10px]" >
            {new Date().toISOString().slice(0, 10).replace(/-/g, ".")} | {new Date().toLocaleTimeString("en-US", { hour12: false })} UTC
          </span>
        </div>

        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="label-eyebrow">Risk Heatmap</span>
            <span className="font-mono text-[10px]" >
              GLOBAL EXPOSURE INDEX
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heatmaps.map((h) => (
              <HeatmapTile key={h.label} label={h.label} level={h.level} count={h.items.length} color={h.color} bg={h.bg} border={h.border} />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="label-eyebrow">Risk Summary</span>
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase"
              style={{ background: oc.bg, border: `1px solid ${oc.border}`, color: oc.color }}
            >
              {risk.overallRiskLevel} Risk
            </span>
          </div>
          <p className="text-sm leading-7" >
            {risk.riskSummary}
          </p>
        </div>

        <div className="card p-6">
          <span className="label-eyebrow">Regulatory Alert Feed</span>
          <div className="mt-4 flex flex-col gap-3">
            {risk.regulatoryOrOtherRisks.length > 0 ? (
              risk.regulatoryOrOtherRisks.map((item, i) => {
                const severity = i === 0 ? { label: "CRITICAL", color: "#EF4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" }
                  : i === 1 ? { label: "MODERATE", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" }
                  : { label: "NEGLIGIBLE", color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" };
                return (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: severity.bg, border: `1px solid ${severity.border}`, color: severity.color }}
                      >
                        {severity.label}
                      </span>
                    </div>
                    <p className="text-sm" >
                      {item}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm" >No regulatory alerts detected.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RiskGroup title="Competitive Risks" items={risk.competitiveRisks} color="#EF4444" />
          <RiskGroup title="Market Risks" items={risk.marketRisks} color="#F59E0B" />
          <RiskGroup title="Financial Risks" items={risk.financialRisks} color="#A78BFA" />
          <RiskGroup title="Other Risks" items={risk.regulatoryOrOtherRisks} color="#6EE7B7" />
        </div>
      </div>

      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className=" sticky top-6 overflow-hidden rounded-2xl p-6"
          style={{
            background: oc.bg,
            border: `2px solid ${oc.border}`,
            backdropFilter: "blur(24px)",
            boxShadow: `0 0 60px ${oc.glow}, 0 24px 60px rgba(0,0,0,0.5)`,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${oc.color}, transparent)` }}
          />

          <span className="label-eyebrow" style={{ color: `${oc.color}80` }}>
            Agent Analysis
          </span>

          <div className="mt-5 flex flex-col items-center">
            <div
              className="rounded-2xl px-8 py-4 text-4xl font-bold tracking-widest"
              style={{
                border: `1px solid ${oc.border}`,
                background: oc.bg,
                color: oc.color,
                boxShadow: `0 0 40px ${oc.glow}`,
                fontFamily: "var(--font-jbmono)",
              }}
            >
              {risk.overallRiskLevel.toUpperCase()}
            </div>

            <div className="mt-6 flex flex-col items-center">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={oc.color}
                  strokeWidth="10"
                  strokeDasharray={`${(riskScore / 100) * 314} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ filter: `drop-shadow(0 0 8px ${oc.color})` }}
                />
                <text x="60" y="55" textAnchor="middle" fill={oc.color} fontSize="22" fontWeight="700" fontFamily="monospace">
                  {riskScore}
                </text>
                <text x="60" y="72" textAnchor="middle" fill="rgba(156,163,175,0.6)" fontSize="9" fontFamily="monospace">
                  RISK SCORE
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { label: "Competitive", count: risk.competitiveRisks.length, color: "#EF4444" },
              { label: "Market", count: risk.marketRisks.length, color: "#F59E0B" },
              { label: "Financial", count: risk.financialRisks.length, color: "#A78BFA" },
              { label: "Regulatory", count: risk.regulatoryOrOtherRisks.length, color: "#6EE7B7" },
            ].map(({ label, count, color }) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center"
                
              >
                <div className="text-2xl font-bold" style={{ color }}>{count}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider" >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <button
              className="w-full rounded-xl py-2.5 font-mono text-xs font-bold tracking-widest transition-all"
              style={{ background: oc.bg, border: `1px solid ${oc.border}`, color: oc.color }}
            >
              Chip Score
            </button>
            <button
              className="w-full rounded-xl py-2.5 font-mono text-xs font-bold tracking-widest transition-all"
              
            >
              Export Risk Report
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function HeatmapTile({ label, level, count, color, bg, border }: {
  label: string; level: string; count: number; color: string; bg: string; border: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl p-4 text-center transition-all duration-200 hover:scale-105"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="font-mono text-[10px] uppercase tracking-widest" >
        {label}
      </div>
      <div className="mt-2 text-lg font-bold" style={{ color }}>
        {level}
      </div>
      <div className="mt-1 font-mono text-xs" style={{ color: `${color}90` }}>
        {count} factor{count !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

function RiskGroup({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items.length) return null;
  return (
    <div className="card p-5">
      <span className="label-eyebrow" style={{ color: `${color}90` }}>
        {title}
      </span>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm" >
            <span className="mt-0.5 shrink-0" style={{ color }}>•</span>
            <span className="leading-6">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
