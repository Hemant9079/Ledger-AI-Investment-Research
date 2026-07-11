import type { FinancialOutput } from "@/agents/state";
import FinancialStrengthGauge from "./FinancialStrengthGauge";
import PriceRangeBar from "./PriceRangeBar";

export default function FinancialAnalysisCard({ financial }: { financial: FinancialOutput }) {
  return (
    <section className="card p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="label-eyebrow">Financial Analysis</span>
        {financial.isPublic && (
          <span className="rounded-full border border-border bg-surface2 px-3 py-1 font-mono text-xs text-muted">
            {financial.tickerSymbol}
          </span>
        )}
      </div>

      {financial.isPublic ? (
        <>
          <div className="mt-5 grid grid-cols-1 gap-4 font-mono sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Price" value={formatMoney(financial.currentPrice, financial.currency)} tone="brand" />
            <Metric label="Market Cap" value={formatLargeNumber(financial.marketCap)} tone="invest" />
            <Metric label="P/E Ratio" value={financial.peRatio?.toFixed(2) ?? "N/A"} tone="ai" />
            <Metric label="EV / Total Capital" value={formatLargeNumber(financial.totalCapitalization)} tone="watch" />
          </div>

          {financial.fiftyTwoWeekLow != null &&
            financial.fiftyTwoWeekHigh != null &&
            financial.currentPrice != null && (
              <PriceRangeBar
                low={financial.fiftyTwoWeekLow}
                high={financial.fiftyTwoWeekHigh}
                current={financial.currentPrice}
                currency={financial.currency}
              />
            )}
        </>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Not publicly traded. Analysis is based on qualitative reasoning.
        </p>
      )}

      <div className="mt-5 flex flex-col items-start gap-6 border-t border-border pt-5 sm:flex-row">
        <div className="flex-1">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
            Financial Summary
          </div>
          <p className="text-sm leading-7 text-ink">{financial.financialSummary}</p>
          {financial.revenueTrend && (
            <div className="mt-4 rounded-xl border border-brand/20 bg-brand/10 p-3">
              <span className="font-mono text-xs text-brand">TREND</span>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {financial.revenueTrend}
              </p>
            </div>
          )}
        </div>
        <div className="shrink-0 rounded-2xl border border-border bg-surface2 p-4">
          <FinancialStrengthGauge score={financial.financialStrengthScore} />
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "brand" | "invest" | "ai" | "watch";
}) {
  const toneClass = {
    brand: "text-brand border-brand/30 bg-brand/10",
    invest: "text-invest border-invest/30 bg-invest/10",
    ai: "text-ai border-ai/30 bg-ai/10",
    watch: "text-watch border-watch/30 bg-watch/10",
  }[tone];

  return (
    <div className="metric-card">
      <div className="mb-3 text-[10px] uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className={`w-fit rounded-lg border px-2 py-1 text-sm font-semibold ${toneClass}`}>
        {value}
      </div>
    </div>
  );
}

function formatMoney(value: number | null, currency: string | null): string {
  if (value == null) return "N/A";
  return `${currency ?? ""} ${value.toFixed(2)}`.trim();
}

function formatLargeNumber(value: number | null): string {
  if (value == null) return "N/A";
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toString();
}
