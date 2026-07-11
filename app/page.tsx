"use client";

import { motion } from "framer-motion";
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

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 premium-grid opacity-30" />
      <div className="ai-glow absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/25 blur-3xl" />
      <div className="ai-glow absolute right-8 top-40 h-80 w-80 rounded-full bg-ai/20 blur-3xl" />

      <div className="relative z-10 overflow-hidden border-b border-border/80 bg-base/45 py-3 backdrop-blur-2xl">
        <div className="ticker-track flex w-max gap-4 whitespace-nowrap font-mono text-xs">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
            <span
              key={`${item.symbol}-${index}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-muted"
            >
              <span className="text-ink">{item.symbol}</span>
              <span
                className={item.move.startsWith("+") ? "text-invest" : "text-pass"}
              >
                {item.move.startsWith("+") ? "up" : "down"} {item.move}
              </span>
            </span>
          ))}
        </div>
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-52px)] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="label-eyebrow mb-6 inline-flex rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-brand">
            Multi-Agent Investment Research
          </span>

          <h1 className="mx-auto max-w-5xl font-display text-5xl leading-[1.02] md:text-7xl lg:text-8xl">
            AI research for public markets,
            <br />
            <span className="gradient-text">built like a trading terminal.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-muted">
            Ask four specialized AI agents to research a company, inspect market data,
            assess risk, and produce one decision-grade investment view.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.65 }}
          className="mt-10 w-full max-w-3xl"
        >
          <SearchBar />
        </motion.div>

      

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.65 }}
          className="mt-14 grid w-full max-w-5xl grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4"
        >
          <AgentPill index="01" name="Research Agent" desc="Company profile, news, market position" />
          <AgentPill index="02" name="Financial Agent" desc="Stock data, revenue trend, strength score" />
          <AgentPill index="03" name="Risk Agent" desc="Competition, market and regulatory risk" />
          <AgentPill index="04" name="Decision Agent" desc="Final verdict with confidence score" />
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-border/80 py-6 text-center font-mono text-xs text-muted backdrop-blur-xl">
        Next.js | LangChain.js | LangGraph.js
      </footer>
    </main>
  );
}

function AgentPill({
  index,
  name,
  desc,
}: {
  index: string;
  name: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="card scan-sheen relative overflow-hidden p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="label-eyebrow">{index}</div>
        <div className="h-2 w-2 rounded-full bg-invest shadow-lg shadow-invest/60" />
      </div>
      <div className="font-display text-xl text-ink">{name}</div>
      <div className="mt-2 text-sm leading-6 text-muted">{desc}</div>
    </motion.div>
  );
}
