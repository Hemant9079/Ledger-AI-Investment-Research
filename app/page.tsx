"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

function BackgroundChart() {
  const W = 1200;
  const H = 420;
  const prices = [
    72, 75, 71, 78, 80, 76, 82, 85, 81, 88,
    84, 90, 87, 93, 96, 92, 99, 103, 98, 106,
    110, 107, 114, 118, 113, 121, 125, 120, 128, 133,
    129, 136, 140, 135, 143, 148, 144, 151, 156, 150,
  ];
  const PAD = { left: 60, right: 40, top: 40, bottom: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const minP = Math.min(...prices) - 5;
  const maxP = Math.max(...prices) + 5;
  const toX = (i: number) => PAD.left + (i / (prices.length - 1)) * chartW;
  const toY = (p: number) => PAD.top + chartH - ((p - minP) / (maxP - minP)) * chartH;

  const pts = prices.map((p, i) => `${toX(i)},${toY(p)}`).join(" ");
  const areaD =
    `M${toX(0)},${toY(prices[0])} ` +
    prices.map((p, i) => `L${toX(i)},${toY(p)}`).join(" ") +
    ` L${toX(prices.length - 1)},${PAD.top + chartH} L${toX(0)},${PAD.top + chartH} Z`;

  const candles = prices.slice(0, -1).map((open, i) => {
    const close = prices[i + 1];
    const high = Math.max(open, close) + Math.random() * 2.5;
    const low = Math.min(open, close) - Math.random() * 2.5;
    const x = toX(i + 0.5);
    const barW = (chartW / prices.length) * 0.55;
    const bullish = close >= open;
    return { x, open, close, high, low, barW, bullish };
  });

  const gridLines = [0.2, 0.4, 0.6, 0.8].map((f) => ({
    y: PAD.top + chartH * f,
    label: Math.round(maxP - f * (maxP - minP)),
  }));

  const pathLen = prices.length * 31; // approximate

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ opacity: 0.13 }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridLines.map((gl) => (
          <g key={gl.y}>
            <line
              x1={PAD.left} y1={gl.y}
              x2={W - PAD.right} y2={gl.y}
              stroke="#10B981" strokeWidth="0.6" strokeDasharray="6 8" opacity="0.4"
            />
            <text
              x={PAD.left - 8} y={gl.y + 4}
              fill="#10B981" fontSize="11" textAnchor="end" opacity="0.55"
              fontFamily="monospace"
            >
              {gl.label}
            </text>
          </g>
        ))}

        <line
          x1={PAD.left} y1={PAD.top + chartH}
          x2={W - PAD.right} y2={PAD.top + chartH}
          stroke="#10B981" strokeWidth="0.8" opacity="0.3"
        />

        {candles.map((c, i) => (
          <g key={i}>
            <line
              x1={c.x} y1={toY(c.high)}
              x2={c.x} y2={toY(c.low)}
              stroke={c.bullish ? "#10B981" : "#EF4444"}
              strokeWidth="1"
              opacity="0.7"
            />
            <rect
              x={c.x - c.barW / 2}
              y={toY(Math.max(c.open, c.close))}
              width={c.barW}
              height={Math.max(1.5, Math.abs(toY(c.open) - toY(c.close)))}
              fill={c.bullish ? "#10B981" : "#EF4444"}
              opacity="0.75"
              rx="1"
            />
          </g>
        ))}

        <path d={areaD} fill="url(#areaGrad)" />

        <polyline
          points={pts}
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          style={{
            strokeDasharray: pathLen,
            strokeDashoffset: pathLen,
            animation: "drawLine 3s ease-out forwards",
          }}
        />

        <circle
          cx={toX(prices.length - 1)}
          cy={toY(prices[prices.length - 1])}
          r="5"
          fill="#10B981"
          style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
        />

        <rect
          x={toX(prices.length - 1) + 10}
          y={toY(prices[prices.length - 1]) - 12}
          width={52} height={20} rx={4}
          fill="#10B981" opacity="0.85"
        />
        <text
          x={toX(prices.length - 1) + 36}
          y={toY(prices[prices.length - 1]) + 2}
          fill="#030712" fontSize="11" textAnchor="middle"
          fontFamily="monospace" fontWeight="700"
        >
          +84.7%
        </text>

        <text
          x={PAD.left} y={PAD.top - 14}
          fill="#10B981" fontSize="13" fontFamily="monospace"
          fontWeight="700" opacity="0.7"
        >
          NVDA  ·  NASDAQ
        </text>
      </svg>
    </div>
  );
}


const TICKER_ITEMS = [
  { symbol: "NVDA", move: "+2.4%" },
  { symbol: "RELIANCE.NS", move: "+0.8%" },
  { symbol: "AAPL", move: "-0.3%" },
  { symbol: "TSLA", move: "+5.1%" },
  { symbol: "TCS.NS", move: "+1.2%" },
  { symbol: "MSFT", move: "+1.0%" },
  { symbol: "AMZN", move: "-0.6%" },
  { symbol: "INFY.NS", move: "+0.4%" },
  { symbol: "GOOGL", move: "+1.8%" },
  { symbol: "HDFCBANK.NS", move: "+0.2%" },
];

const AGENT_CARDS: { index: string; name: string; desc: string; icon: ReactNode; glow: string }[] = [
  {
    index: "01",
    name: "Research Agent",
    desc: "Company profile, news, competitive landscape",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
    ),
    glow: "rgba(16, 185, 129, 0.2)"
  },
  {
    index: "02",
    name: "Financial Agent",
    desc: "Stock data, revenue trends, strength score",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    glow: "rgba(52, 211, 153, 0.2)"
  },
  {
    index: "03",
    name: "Risk Agent",
    desc: "Competition, market and regulatory risks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 20h20L12 2z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    glow: "rgba(16, 185, 129, 0.15)"
  },
  {
    index: "04",
    name: "Decision Agent",
    desc: "Final verdict with confidence score",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    glow: "rgba(52, 211, 153, 0.25)"
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <BackgroundChart />
      </div>

      <nav className="nav-bar relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-none">
              <span
                className="font-mono text-[13px] font-black tracking-[0.18em] uppercase"
                style={{ color: "#f0fdf4", letterSpacing: "0.2em" }}
              >
                Ledger
              </span>
              <span
                className="font-mono text-[9px] tracking-[0.35em] uppercase"
                style={{ color: "rgba(16,185,129,0.75)", letterSpacing: "0.4em" }}
              >
                Intelligence
              </span>
            </div>
          </div>


          <div className="hidden items-center gap-6 sm:flex">
            <Link
              href="/docs"
              className="font-mono text-xs tracking-wider text-muted transition-colors hover:text-invest"
            >
              Docs
            </Link>
            <a
              href="https://github.com/Hemant9079/Ledger-AI-Investment-Research"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted transition-colors hover:text-invest"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <button
              onClick={() => document.getElementById("agents-section")?.scrollIntoView({ behavior: "smooth" })}
              className="font-mono text-xs tracking-wider text-muted transition-colors hover:text-invest"
            >
              About
            </button>
          </div>

          <div className="flex items-center gap-3">

            <Link
              href="/login"
              id="nav-login"
              className="hidden font-mono text-xs tracking-wider text-muted transition-colors hover:text-invest sm:block"
            >
              Log In
            </Link>

            <Link
              href="/signup"
              id="nav-signup"
              className="btn-neon rounded-full px-4 py-1.5 font-mono text-xs font-bold tracking-wider"
              style={{ fontSize: "0.7rem" }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>



      <div className="relative z-10 overflow-hidden border-b border-invest/10 bg-base/60 py-2.5 backdrop-blur-xl">
        <div className="ticker-track flex w-max gap-3 whitespace-nowrap font-mono text-[11px]">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <span
              key={`${item.symbol}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
              style={{
                borderColor: "rgba(16,185,129,0.15)",
                background: "rgba(10,20,14,0.6)",
              }}
            >
              <span className="text-ink">{item.symbol}</span>
              <span
                className="font-semibold"
                style={{ color: item.move.startsWith("+") ? "#10B981" : "#EF4444" }}
              >
                {item.move}
              </span>
            </span>
          ))}
        </div>
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-108px)] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        


        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mx-auto mt-8 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        >
          Research any stock.{" "}
          <br />
          <span className="text-invest">Decide with confidence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.65 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted"
        >
          Four specialized AI agents research a company end-to-end — market data,
          financials, risk, and sentiment — then deliver one{" "}
          <span style={{ color: "#10B981", fontWeight: 600 }}>decision-grade</span> investment view.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.65 }}
          className="mt-12 w-full max-w-2xl"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          id="agents-section"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.7 }}
          className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 text-left lg:grid-cols-4"
        >
          {AGENT_CARDS.map((agent, i) => (
            <AgentCard key={agent.index} {...agent} delay={i * 0.06} />
          ))}
        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { val: "4", label: "Specialized Agents" },
            { val: "< 60s", label: "Analysis Time" },
            { val: "100%", label: "AI-Powered" },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div
                className="font-mono text-2xl font-bold"
                style={{ color: "#10B981" }}
              >
                {val}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <footer className="relative z-10 border-t py-6 text-center font-mono text-[11px] tracking-widest text-muted"
        style={{ borderColor: "rgba(16,185,129,0.1)" }}
      >
        <span className="text-invest">LEDGER.AI</span> · Built with Next.js · LangChain · LangGraph
      </footer>
    </main>
  );
}

function AgentCard({
  index,
  name,
  desc,
  icon,
  delay,
}: {
  index: string;
  name: string;
  desc: string;
  icon: ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + delay, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="card relative overflow-hidden p-5 transition-all duration-300"
      style={{ cursor: "default" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(22, 163, 74, 0.4), transparent)",
        }}
      />

      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-invest/70">{index}</span>
        <div className="h-1.5 w-1.5 rounded-full bg-invest opacity-60" />
      </div>

      <div
        className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl"
        style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.18)",
        }}
      >
        {icon}
      </div>

      <div className="text-sm font-semibold tracking-wide text-ink">{name}</div>

      <div className="mt-1.5 text-xs leading-5" style={{ color: "rgba(156,163,175,0.85)" }}>
        {desc}
      </div>
    </motion.div>
  );
}
