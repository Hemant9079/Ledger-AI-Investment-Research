import type { DecisionOutput } from "@/agents/state";
import ConfidenceGauge from "./ConfidenceGauge";

export default function DecisionCard({ decision }: { decision: DecisionOutput }) {
  const isInvest = decision.decision === "INVEST";
  
  return (
    <section className={`sticky top-6 overflow-hidden rounded-2xl p-6 bg-surface border ${isInvest ? 'border-invest/30' : 'border-pass/30'}`}>
      <span className={`font-mono text-[10px] tracking-[0.22em] uppercase ${isInvest ? 'text-invest/80' : 'text-pass/80'}`}>
        Investment Decision
      </span>

      <div className="mt-5 flex flex-col items-center">
        <div
          className={`rounded-2xl px-10 py-4 text-4xl font-bold tracking-widest font-mono border ${isInvest ? 'bg-invest/10 border-invest/30 text-invest' : 'bg-pass/10 border-pass/30 text-pass'}`}
        >
          {decision.decision}
        </div>
        <ConfidenceGauge score={decision.confidenceScore} color={isInvest ? '#16a34a' : '#dc2626'} />
      </div>

      <p className="mt-4 rounded-xl p-4 text-center text-sm leading-7 text-ink bg-surface2 border border-border">
        {decision.verdictSummary}
      </p>

      <DecisionList
        title="Strengths"
        items={decision.reasons}
        marker="✓"
        colorClass="text-invest"
      />
      <DecisionList
        title="Opportunities"
        items={decision.opportunities}
        marker="↑"
        colorClass="text-invest"
      />
      <DecisionList
        title="Key Risks"
        items={decision.risks}
        marker="!"
        colorClass="text-pass"
      />
    </section>
  );
}

function DecisionList({
  title,
  items,
  marker,
  colorClass,
}: {
  title: string;
  items: string[];
  marker: string;
  colorClass: string;
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-5">
      <span className={`font-mono text-[10px] uppercase tracking-widest ${colorClass} opacity-80`}>
        {title}
      </span>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="flex gap-3 rounded-xl p-3 text-sm bg-surface2 border border-border"
          >
            <span className={`mt-0.5 shrink-0 font-mono text-xs font-bold ${colorClass}`}>
              {marker}
            </span>
            <span className="leading-6 text-ink">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
