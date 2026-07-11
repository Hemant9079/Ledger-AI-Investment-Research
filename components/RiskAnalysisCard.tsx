import type { RiskOutput } from "@/agents/state";
import RiskBarChart from "./RiskBarChart";

const RISK_COLOR: Record<RiskOutput["overallRiskLevel"], string> = {
  Low:    "text-invest border-invest/40 bg-invest/10",
  Medium: "text-watch  border-watch/40  bg-watch/10",
  High:   "text-pass   border-pass/40   bg-pass/10",
};

const RISK_BULLET: Record<RiskOutput["overallRiskLevel"], string> = {
  Low:    "text-invest",
  Medium: "text-watch",
  High:   "text-pass",
};

export default function RiskAnalysisCard({ risk }: { risk: RiskOutput }) {
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">Risk Analysis</span>
        <span className={`font-mono text-xs border rounded-full px-3 py-1 ${RISK_COLOR[risk.overallRiskLevel]}`}>
          {risk.overallRiskLevel} Risk
        </span>
      </div>

      <p className="mt-4 text-sm text-ink leading-relaxed">{risk.riskSummary}</p>


      <RiskBarChart
        competitiveRisks={risk.competitiveRisks}
        marketRisks={risk.marketRisks}
        financialRisks={risk.financialRisks}
        regulatoryOrOtherRisks={risk.regulatoryOrOtherRisks}
      />


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
        <RiskGroup title="Competitive Risks"  items={risk.competitiveRisks}        bullet={RISK_BULLET[risk.overallRiskLevel]} />
        <RiskGroup title="Market Risks"       items={risk.marketRisks}             bullet={RISK_BULLET[risk.overallRiskLevel]} />
        <RiskGroup title="Financial Risks"    items={risk.financialRisks}          bullet={RISK_BULLET[risk.overallRiskLevel]} />
        <RiskGroup title="Regulatory / Other" items={risk.regulatoryOrOtherRisks}  bullet={RISK_BULLET[risk.overallRiskLevel]} />
      </div>
    </section>
  );
}

function RiskGroup({ title, items, bullet }: { title: string; items: string[]; bullet: string }) {
  if (!items.length) return null;
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{title}</span>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-ink flex gap-2">
            <span className={bullet}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
