"use client";

import { motion } from "framer-motion";
import type { FinancialOutput } from "@/agents/state";
import FinancialStrengthGauge from "@/components/FinancialStrengthGauge";
import PriceRangeBar from "@/components/PriceRangeBar";
import StockPerformanceGraph from "@/components/StockPerformanceGraph";

interface Props {
  financial: FinancialOutput;
}

function fmt(v: number | null, currency?: string | null): string {
  if (v == null) return "N/A";
  return `${currency ?? ""} ${v.toFixed(2)}`.trim();
}

function fmtLarge(v: number | null, currency?: string | null): string {
  if (v == null) return "N/A";
  const p = currency ? `${currency} ` : "";
  if (v >= 1e12) return `${p}${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${p}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${p}${(v / 1e6).toFixed(2)}M`;
  return `${p}${v.toLocaleString()}`;
}

export default function FinancialsTab({ financial }: Props) {
  const score = financial.financialStrengthScore;
  const scoreColor = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
  const scoreLabel = score >= 75 ? "Optimal" : score >= 50 ? "Moderate" : "Weak";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col gap-6"
    >
      <div
        className="flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-3"
        
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest" >
            [F] Financial Agent
          </span>
          {financial.sector && (
            <span className="font-mono text-[10px]" >
              SECTOR: {financial.sector.toUpperCase()}
            </span>
          )}
          {financial.country && (
            <span className="font-mono text-[10px]" >
              · REGION: {financial.country.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest"
            
          >
            ● MARKET OPEN
          </span>
          {financial.tickerSymbol && (
            <span className="font-mono text-sm font-bold" >
              {financial.tickerSymbol}
            </span>
          )}
        </div>
      </div>

      {financial.isPublic && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            className="card flex flex-col justify-between p-6"
            
          >
            <span className="label-eyebrow">Live Price</span>
            <div className="mt-2 text-4xl font-bold" >
              {fmt(financial.currentPrice, financial.currency)}
            </div>
            {financial.fiftyTwoWeekLow != null && financial.fiftyTwoWeekHigh != null && financial.currentPrice != null && (
              <PriceRangeBar
                low={financial.fiftyTwoWeekLow}
                high={financial.fiftyTwoWeekHigh}
                current={financial.currentPrice}
                currency={financial.currency}
              />
            )}
          </div>

          <div
            className="card flex flex-col items-center justify-center p-6"
            
          >
            <span className="label-eyebrow">AI Health Check</span>
            <div className="mt-4">
              <FinancialStrengthGauge score={score} />
            </div>
            <p className="mt-3 text-center text-xs" >
              Financial health verified as{" "}
              <span className="font-semibold" style={{ color: scoreColor }}>
                {scoreLabel}
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="card p-6">
        <span className="label-eyebrow">Financial Snapshot</span>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SnapMetric label="Market Cap" value={fmtLarge(financial.marketCap, financial.currency)} color="#10B981" />
          <SnapMetric label="P/E Ratio" value={financial.peRatio?.toFixed(2) ?? "N/A"} color="#6EE7B7" />
          <SnapMetric label="Enterprise Value" value={fmtLarge(financial.totalCapitalization, financial.currency)} color="#34D399" />
          <SnapMetric label="Financial Strength" value={`${score} / 100`} color={scoreColor} />
        </div>
      </div>

      {financial.isPublic && financial.tickerSymbol && (
        <StockPerformanceGraph symbol={financial.tickerSymbol} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <span className="label-eyebrow">Revenue Trend</span>
          {financial.revenueTrend ? (
            <p className="mt-4 text-sm leading-7" >
              {financial.revenueTrend}
            </p>
          ) : (
            <p className="mt-4 text-sm" >
              Trend data unavailable
            </p>
          )}
        </div>

        <div className="card p-6">
          <span className="label-eyebrow">Balance Sheet Core</span>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <BalanceItem
              label="Total Capitalization"
              value={fmtLarge(financial.totalCapitalization, financial.currency)}
              icon="↑"
              color="#10B981"
            />
            <BalanceItem
              label="Market Cap"
              value={fmtLarge(financial.marketCap, financial.currency)}
              icon="↗"
              color="#F59E0B"
            />
            <BalanceItem
              label="P/E Ratio"
              value={financial.peRatio?.toFixed(2) ?? "N/A"}
              icon="≈"
              color="#6EE7B7"
            />
            <BalanceItem
              label="52W Range"
              value={financial.fiftyTwoWeekLow != null && financial.fiftyTwoWeekHigh != null
                ? `${fmt(financial.fiftyTwoWeekLow)} – ${fmt(financial.fiftyTwoWeekHigh)}`
                : "N/A"}
              icon="↔"
              color="#A78BFA"
            />
          </div>
        </div>
      </div>

      <div className="card relative overflow-hidden p-6">
        <div
          className="absolute inset-x-0 top-0 h-px"
          
        />
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-mono text-xs font-bold"
            
          >
            AI
          </div>
          <div>
            <span className="label-eyebrow">AI Valuation Model · Financial Summary</span>
            <p className="mt-3 text-sm leading-7" >
              {financial.financialSummary}
            </p>
            {financial.longBusinessSummary && (
              <p className="mt-3 text-sm leading-7" >
                {financial.longBusinessSummary.slice(0, 400)}
                {financial.longBusinessSummary.length > 400 ? "…" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="btn-neon rounded-xl px-6 py-2.5 font-mono text-xs font-bold tracking-widest"
          >
            Strategic Invest
          </button>
          <button
            className="rounded-xl px-6 py-2.5 font-mono text-xs font-bold tracking-widest transition-all"
            
          >
            View Risk Nodes →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SnapMetric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="metric-card flex flex-col justify-between"
    >
      <div className="mb-3 font-mono text-[10px] uppercase tracking-wider" >
        {label}
      </div>
      <div className="text-lg font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function BalanceItem({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3"
      
    >
      <span className="mt-0.5 font-mono text-sm font-bold" style={{ color }}>
        {icon}
      </span>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider" >
          {label}
        </div>
        <div className="mt-0.5 text-sm font-semibold" >
          {value}
        </div>
      </div>
    </div>
  );
}
