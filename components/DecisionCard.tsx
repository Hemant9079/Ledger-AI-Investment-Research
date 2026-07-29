import type { DecisionOutput } from "@/agents/state";
import ConfidenceGauge from "./ConfidenceGauge";

export default function DecisionCard({ decision }: { decision: DecisionOutput }) {
  const isInvest = decision.decision === "INVEST";
  const accentColor = isInvest ? "#10B981" : "#EF4444";
  const accentBg = isInvest ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)";
  const accentBorder = isInvest ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)";
  const accentGlow = isInvest ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)";

  return (
    <section
      className="scan-sheen sticky top-6 overflow-hidden rounded-2xl p-6 backdrop-blur-xl"
      style={{
        background: accentBg,
        border: `2px solid ${accentBorder}`,
        backdropFilter: "blur(24px)",
        boxShadow: `0 0 60px ${accentGlow}, 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 ${accentBorder}`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      <span className="label-eyebrow" style={{ color: `${accentColor}80` }}>
        Investment Decision
      </span>

      {/* Decision badge */}
      <div className="mt-5 flex flex-col items-center">
        <div
          className="rounded-2xl px-10 py-4 text-4xl font-bold tracking-widest"
          style={{
            border: `1px solid ${accentBorder}`,
            background: accentBg,
            color: accentColor,
            boxShadow: `0 0 40px ${accentGlow}, inset 0 1px 0 ${accentBorder}`,
            fontFamily: "var(--font-jbmono)",
          }}
        >
          {decision.decision}
        </div>
        <ConfidenceGauge score={decision.confidenceScore} color={accentColor} />
      </div>

      {/* Verdict summary */}
      <p
        className="mt-4 rounded-xl p-4 text-center text-sm leading-7 text-ink"
        style={{
          background: "rgba(3,7,18,0.4)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {decision.verdictSummary}
      </p>

      <DecisionList
        title="Strengths"
        items={decision.reasons}
        marker="✓"
        color="#10B981"
      />
      <DecisionList
        title="Opportunities"
        items={decision.opportunities}
        marker="↑"
        color="#34D399"
      />
      <DecisionList
        title="Key Risks"
        items={decision.risks}
        marker="!"
        color="#EF4444"
      />
    </section>
  );
}

function DecisionList({
  title,
  items,
  marker,
  color,
}: {
  title: string;
  items: string[];
  marker: string;
  color: string;
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-5">
      <span
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: `${color}80` }}
      >
        {title}
      </span>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="flex gap-3 rounded-xl p-3 text-sm"
            style={{
              background: "rgba(10,20,14,0.6)",
              border: "1px solid rgba(16,185,129,0.1)",
            }}
          >
            <span
              className="mt-0.5 shrink-0 font-mono text-xs font-bold"
              style={{ color }}
            >
              {marker}
            </span>
            <span className="leading-6 text-ink">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
