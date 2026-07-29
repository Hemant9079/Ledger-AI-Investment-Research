"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";


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

const AGENT_CARDS = [
  {
    index: "01",
    name: "Research Agent",
    desc: "Company profile, news, competitive landscape",
    icon: "🔍",
    glow: "rgba(16, 185, 129, 0.2)"
  },
  {
    index: "02",
    name: "Financial Agent",
    desc: "Stock data, revenue trends, strength score",
    icon: "📊",
    glow: "rgba(52, 211, 153, 0.2)"
  },
  {
    index: "03",
    name: "Risk Agent",
    desc: "Competition, market and regulatory risks",
    icon: "⚠️",
    glow: "rgba(16, 185, 129, 0.15)"
  },
  {
    index: "04",
    name: "Decision Agent",
    desc: "Final verdict with confidence score",
    icon: "✅",
    glow: "rgba(52, 211, 153, 0.25)"
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ── Background layers ── */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        {/* Large radial glow at top center */}
        <div
          className="ai-glow absolute left-1/2 -top-32 h-[600px] w-[700px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(16,185,129,0.22) 0%, transparent 70%)",
          }}
        />
        {/* Side accent glows */}
        <div
          className="ai-glow absolute -right-20 top-48 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)",
            animationDelay: "2s",
          }}
        />
        <div
          className="ai-glow absolute -left-10 top-96 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className="nav-bar relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                background: "linear-gradient(135deg, #059669, #10B981)",
                boxShadow: "0 0 20px rgba(16,185,129,0.5)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
                  stroke="#030712"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill="rgba(3,7,18,0.3)"
                />
                <path d="M8 5V11M5 8H11" stroke="#030712" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-mono text-sm font-bold tracking-widest text-ink">
              LEDGER<span className="text-invest">.</span>AI
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden items-center gap-6 sm:flex">
            {["Docs", "GitHub", "About"].map((item) => (
              <span
                key={item}
                className="cursor-pointer font-mono text-xs tracking-wider text-muted transition-colors hover:text-invest"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Right side: Status + Auth buttons */}
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <div className="hidden items-center gap-2 rounded-full border border-invest/20 bg-invest/8 px-3 py-1.5 sm:flex">
              <div className="active-dot" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-invest">
                Live
              </span>
            </div>

            {/* Login button */}
            <Link
              href="/login"
              id="nav-login"
              className="hidden font-mono text-xs tracking-wider text-muted transition-colors hover:text-invest sm:block"
            >
              Log In
            </Link>

            {/* Sign Up button */}
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


      {/* ── Ticker strip ── */}
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

      {/* ── Hero section ── */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-108px)] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#10B981",
              boxShadow: "0 0 20px rgba(16,185,129,0.15)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-invest"
              style={{ boxShadow: "0 0 8px rgba(16,185,129,0.8)" }}
            />
            Multi-Agent AI · Investment Research
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mx-auto mt-8 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        >
          Research any stock.{" "}
          <br />
          <span className="gradient-text">Decide with confidence.</span>
        </motion.h1>

        {/* Sub-headline */}
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

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.65 }}
          className="mt-12 w-full max-w-2xl"
        >
          <SearchBar />
        </motion.div>

        {/* Agent cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.7 }}
          className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 text-left lg:grid-cols-4"
        >
          {AGENT_CARDS.map((agent, i) => (
            <AgentCard key={agent.index} {...agent} delay={i * 0.06} />
          ))}
        </motion.div>

        {/* Bottom stats strip */}
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

      {/* ── Footer ── */}
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
  icon: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + delay, duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="card scan-sheen relative overflow-hidden p-5 transition-all duration-300"
      style={{
        cursor: "default",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)",
        }}
      />

      {/* Index + dot */}
      <div className="mb-4 flex items-center justify-between">
        <span className="label-eyebrow">{index}</span>
        <div
          className="h-2 w-2 rounded-full"
          style={{
            background: "#10B981",
            boxShadow: "0 0 8px rgba(16,185,129,0.9), 0 0 16px rgba(16,185,129,0.4)",
          }}
        />
      </div>

      {/* Icon */}
      <div className="mb-3 text-2xl">{icon}</div>

      {/* Name */}
      <div className="text-sm font-semibold tracking-wide text-ink">{name}</div>

      {/* Desc */}
      <div className="mt-1.5 text-xs leading-5" style={{ color: "rgba(156,163,175,0.85)" }}>
        {desc}
      </div>
    </motion.div>
  );
}
