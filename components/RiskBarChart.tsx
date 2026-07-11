"use client";

interface RiskBarChartProps {
  competitiveRisks: string[];
  marketRisks: string[];
  financialRisks: string[];
  regulatoryOrOtherRisks: string[];
}

const CATEGORIES = [
  { key: "competitiveRisks",      label: "Competitive",  color: "#F87171" },
  { key: "marketRisks",           label: "Market",       color: "#FBBF24" },
  { key: "financialRisks",        label: "Financial",    color: "#60A5FA" },
  { key: "regulatoryOrOtherRisks",label: "Regulatory",   color: "#A78BFA" },
] as const;

export default function RiskBarChart(props: RiskBarChartProps) {
  const maxCount = Math.max(
    ...CATEGORIES.map((c) => props[c.key].length),
    1
  );

  return (
    <div className="mt-4 mb-6">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-3">
        Risk Exposure by Category
      </div>
      <div className="flex flex-col gap-2.5">
        {CATEGORIES.map(({ key, label, color }) => {
          const count = props[key].length;
          const pct = (count / maxCount) * 100;
          return (
            <div key={key} className="flex items-center gap-3">
              <span
                className="font-mono text-[10px] text-muted w-24 shrink-0 text-right"
              >
                {label}
              </span>
              <div className="flex-1 h-5 bg-surface2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center px-2 transition-all duration-700"
                  style={{
                    width: `${Math.max(pct, 8)}%`,
                    backgroundColor: color,
                    opacity: 0.85,
                  }}
                />
              </div>
              <span
                className="font-mono text-xs w-5 text-right"
                style={{ color }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
