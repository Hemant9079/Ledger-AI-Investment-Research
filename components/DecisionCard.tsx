import type { DecisionOutput } from "@/agents/state";
import ConfidenceGauge from "./ConfidenceGauge";

export default function DecisionCard({ decision }: { decision: DecisionOutput }) {
  const isInvest = decision.decision === "INVEST";
  const color = isInvest ? "#10B981" : "#EF4444";
  const toneClass = isInvest
    ? "border-invest/40 bg-invest/10 text-invest shadow-invest/15"
    : "border-pass/40 bg-pass/10 text-pass shadow-pass/15";

  return (
    <section className={`card sticky top-6 overflow-hidden border-2 p-6 shadow-2xl ${toneClass}`}>
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-70" />
      <span className="label-eyebrow">Investment Decision</span>

      <div className="mt-5 flex flex-col items-center">
        <div className="rounded-2xl border border-current/35 px-8 py-3 font-display text-4xl font-bold tracking-wide shadow-lg">
          {decision.decision}
        </div>
        <ConfidenceGauge score={decision.confidenceScore} color={color} />
      </div>

      <p className="mt-2 rounded-xl border border-border bg-base/25 p-4 text-center text-sm leading-7 text-ink">
        {decision.verdictSummary}
      </p>

      <DecisionList title="Strengths" items={decision.reasons} marker="OK" tone="text-brand" />
      <DecisionList title="Opportunities" items={decision.opportunities} marker="UP" tone="text-invest" />
      <DecisionList title="Key Risks" items={decision.risks} marker="!" tone="text-pass" />
    </section>
  );
}

function DecisionList({
  title,
  items,
  marker,
  tone,
}: {
  title: string;
  items: string[];
  marker: string;
  tone: string;
}) {
  if (!items?.length) return null;
  return (
    <div className="mt-5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
        {title}
      </span>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="flex gap-3 rounded-xl border border-border bg-surface2 p-3 text-sm"
          >
            <span className={`font-mono text-xs font-bold ${tone}`}>{marker}</span>
            <span className="leading-6 text-ink">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
