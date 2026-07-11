"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  StockPerformanceData,
  StockPricePoint,
  StockRange,
} from "@/services/stockPerformanceService";

const RANGES: Array<{ label: string; value: StockRange }> = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
  { label: "Max", value: "max" },
];

export default function StockPerformanceGraph({
  symbol,
}: {
  symbol: string | null;
}) {
  const [range, setRange] = useState<StockRange>("1d");
  const [data, setData] = useState<StockPerformanceData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const controller = new AbortController();
    const activeSymbol = symbol;

    async function fetchChart() {
      setStatus("loading");
      setError("");
      try {
        const response = await fetch(
          `/api/stock-performance?symbol=${encodeURIComponent(
            activeSymbol
          )}&range=${range}`,
          { signal: controller.signal, cache: "no-store" }
        );
        const json = await response.json();
        if (!response.ok) throw new Error(json?.error ?? "Stock data failed.");
        setData(json);
        setStatus("success");
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message ?? "Unable to load stock movement.");
        setStatus("error");
      }
    }

    fetchChart();
    return () => controller.abort();
  }, [symbol, range]);

  const chart = useMemo(() => buildChart(data?.points ?? []), [data]);
  const accent = data?.behavior === "down" ? "#F87171" : "#34D399";
  const activePoint =
    hoverIndex != null && data?.points ? data.points[hoverIndex] : null;

  if (!symbol) return null;

  return (
    <section className="card p-6 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="label-eyebrow">Stock Performance</span>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl text-ink">
              {data?.longName ?? symbol}
            </h2>
            <span
              className={`font-mono text-xs px-2 py-1 rounded-full border ${
                data?.behavior === "down"
                  ? "text-pass border-pass/30 bg-pass/10"
                  : "text-invest border-invest/30 bg-invest/10"
              }`}
            >
              {data?.behavior === "down"
                ? "Down"
                : data?.behavior === "flat"
                ? "Flat"
                : "Up"}{" "}
              {formatPercent(data?.percentChange)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface2 p-1">
          {RANGES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value)}
              className={`h-8 rounded-md px-3 font-mono text-xs transition-colors ${
                range === item.value
                  ? "bg-ink text-base"
                  : "text-muted hover:text-ink hover:bg-surface"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Metric label="Open" value={formatMoney(data?.openPrice, data?.currency)} />
        <Metric label="Close" value={formatMoney(data?.closePrice, data?.currency)} />
        <Metric label="High" value={formatMoney(data?.highPrice, data?.currency)} />
        <Metric label="Low" value={formatMoney(data?.lowPrice, data?.currency)} />
        <Metric label="IPO Date" value={formatDate(data?.ipoDate, true)} />
      </div>

      <div className="relative mt-6 h-[320px] rounded-lg border border-border bg-[#0D131B]">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-[#0D131B]/70 text-sm text-muted">
            Loading latest market data...
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 z-10 grid place-items-center px-6 text-center text-sm text-pass">
            {error}
          </div>
        )}

        {chart && (
          <svg
            ref={svgRef}
            viewBox="0 0 900 320"
            className="h-full w-full"
            role="img"
            aria-label={`${symbol} stock price chart`}
            onMouseLeave={() => setHoverIndex(null)}
            onMouseMove={(event) => {
              const svg = svgRef.current;
              if (!svg || chart.positions.length === 0) return;
              const rect = svg.getBoundingClientRect();
              const ratio = (event.clientX - rect.left) / rect.width;
              const x = ratio * 900;
              const nearest = chart.positions.reduce((best, current, index) => {
                const bestDistance = Math.abs(chart.positions[best].x - x);
                const currentDistance = Math.abs(current.x - x);
                return currentDistance < bestDistance ? index : best;
              }, 0);
              setHoverIndex(nearest);
            }}
          >
            <defs>
              <linearGradient id="stockArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.24" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>

            {chart.gridLines.map((line) => (
              <line
                key={line}
                x1="44"
                x2="872"
                y1={line}
                y2={line}
                stroke="#232C38"
                strokeDasharray="4 6"
              />
            ))}

            <path d={chart.areaPath} fill="url(#stockArea)" />
            <path
              d={chart.linePath}
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {data?.events.map((event) => {
              const eventPosition = findEventPosition(event.date, chart.positions);
              if (!eventPosition) return null;
              return (
                <g key={`${event.type}-${event.date}`} transform={`translate(${eventPosition.x} 36)`}>
                  <line y1="0" y2="248" stroke="#FBBF24" strokeOpacity="0.35" />
                  <circle r="4" fill="#FBBF24" />
                </g>
              );
            })}

            {activePoint && hoverIndex != null && (
              <g>
                <line
                  x1={chart.positions[hoverIndex].x}
                  x2={chart.positions[hoverIndex].x}
                  y1="24"
                  y2="292"
                  stroke="#8A94A6"
                  strokeDasharray="4 6"
                />
                <circle
                  cx={chart.positions[hoverIndex].x}
                  cy={chart.positions[hoverIndex].y}
                  r="5"
                  fill={accent}
                  stroke="#0B0F14"
                  strokeWidth="3"
                />
              </g>
            )}
          </svg>
        )}

        {activePoint && hoverIndex != null && (
          <div
            className="pointer-events-none absolute top-4 rounded-lg border border-border bg-base/95 px-3 py-2 shadow-xl"
            style={{
              left: `${Math.min(
                76,
                Math.max(4, (chart!.positions[hoverIndex].x / 900) * 100)
              )}%`,
            }}
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {formatDate(activePoint.date)}
            </div>
            <div className="mt-1 text-sm font-semibold text-ink">
              {formatMoney(activePoint.price, data?.currency)}
            </div>
            <div
              className={`text-xs ${
                activePoint.percentChange >= 0 ? "text-invest" : "text-pass"
              }`}
            >
              {formatPercent(activePoint.percentChange)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.72fr]">
        <div className="rounded-lg bg-surface2 p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Market Behavior
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {data?.behavior === "down"
              ? "Sellers are controlling this range, with price trading below the opening level."
              : data?.behavior === "flat"
              ? "Price is moving sideways with limited net change over this range."
              : "Buyers are leading this range, with price trading above the opening level."}
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            Source: {data?.source ?? "Yahoo Finance"} | Updated{" "}
            {formatDate(data?.generatedAt)}
          </p>
        </div>

        <div className="rounded-lg bg-surface2 p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Key Events
          </div>
          <div className="mt-3 space-y-3">
            {data?.events.length ? (
              data.events.map((event) => (
                <div key={`${event.type}-${event.date}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-ink">{event.title}</span>
                    <span className="font-mono text-[10px] text-muted">
                      {formatDate(event.date, true)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {event.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">
                No major price events detected for this range.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface2 p-3">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function buildChart(points: StockPricePoint[]) {
  if (points.length < 2) return null;

  const width = 900;
  const height = 320;
  const padding = { top: 28, right: 28, bottom: 28, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const prices = points.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const spread = max - min || 1;

  const positions = points.map((point, index) => ({
    date: point.date,
    x: padding.left + (index / (points.length - 1)) * plotWidth,
    y: padding.top + ((max - point.price) / spread) * plotHeight,
  }));

  const linePath = positions
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${positions[positions.length - 1].x} ${
    height - padding.bottom
  } L ${positions[0].x} ${height - padding.bottom} Z`;

  return {
    positions,
    linePath,
    areaPath,
    gridLines: [72, 132, 192, 252],
  };
}

function findEventPosition(
  date: string,
  positions: Array<{ date: string; x: number; y: number }>
) {
  const eventTime = new Date(date).getTime();
  return positions.reduce((best, position) => {
    const bestDistance = Math.abs(new Date(best.date).getTime() - eventTime);
    const currentDistance = Math.abs(new Date(position.date).getTime() - eventTime);
    return currentDistance < bestDistance ? position : best;
  }, positions[0]);
}

function formatMoney(value: number | null | undefined, currency: string | null | undefined) {
  if (value == null) return "N/A";
  return `${currency ?? ""} ${value.toFixed(2)}`.trim();
}

function formatPercent(value: number | null | undefined) {
  if (value == null) return "N/A";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatDate(value: string | null | undefined, dateOnly = false) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: dateOnly ? "numeric" : undefined,
    hour: dateOnly ? undefined : "2-digit",
    minute: dateOnly ? undefined : "2-digit",
  }).format(date);
}
