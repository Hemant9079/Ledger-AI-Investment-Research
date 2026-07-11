"use client";

interface PriceRangeBarProps {
  low: number;
  high: number;
  current: number;
  currency: string | null;
}

export default function PriceRangeBar({ low, high, current, currency }: PriceRangeBarProps) {
  const range = high - low;
  const pct = range > 0 ? Math.min(Math.max(((current - low) / range) * 100, 0), 100) : 50;
  const sym = currency ?? "";

  return (
    <div className="mt-5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
        52-Week Price Range
      </div>
      <div className="relative h-3 bg-surface2 rounded-full overflow-visible mx-1">

        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #60A5FA, #34D399)",
          }}
        />

        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white bg-brand shadow-md z-10"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted mt-2">
        <span>Low {sym} {low.toFixed(2)}</span>
        <span className="text-ink font-semibold">
          Current: {sym} {current.toFixed(2)}
        </span>
        <span>High {sym} {high.toFixed(2)}</span>
      </div>
    </div>
  );
}
