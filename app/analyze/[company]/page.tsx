"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { AgentState } from "@/agents/state";
import LoadingState from "@/components/LoadingState";
import CompanyOverviewCard from "@/components/CompanyOverviewCard";
import ResearchSummaryCard from "@/components/ResearchSummaryCard";
import FinancialAnalysisCard from "@/components/FinancialAnalysisCard";
import RiskAnalysisCard from "@/components/RiskAnalysisCard";
import DecisionCard from "@/components/DecisionCard";
import StockPerformanceGraph from "@/components/StockPerformanceGraph";

type Status = "loading" | "success" | "error";

export default function AnalyzePage({ params }: { params: { company: string } }) {
  const companyName = decodeURIComponent(params.company);
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<AgentState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus("loading");
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? "Analysis failed.");
        if (cancelled) return;
        setData(json);
        setStatus("success");
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err?.message ?? "Something went wrong.");
        setStatus("error");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [companyName]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="ai-glow absolute left-1/3 -top-20 h-96 w-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="ai-glow absolute right-10 top-64 h-72 w-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)",
            animationDelay: "2.5s",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Header bar ── */}
        <header
          className="mb-8 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 backdrop-blur-xl"
          style={{
            background: "rgba(10,20,14,0.7)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs transition-colors"
            style={{ color: "rgba(16,185,129,0.7)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back</span>
            <span className="text-muted">/ New search</span>
          </Link>

          {/* Center label */}
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: "#10B981",
                boxShadow: "0 0 8px rgba(16,185,129,0.9)",
                animation: "glow-pulse 2s ease-in-out infinite",
              }}
            />
            <span className="label-eyebrow">Investment Research Dashboard</span>
          </div>

          {/* Logo mark */}
          <span className="font-mono text-xs font-bold tracking-widest" style={{ color: "#10B981" }}>
            LEDGER.AI
          </span>
        </header>

        {/* ── Company title ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="label-eyebrow">Company Intelligence</span>
            <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {companyName}
            </h1>
          </div>
          {data?.financial?.tickerSymbol && (
            <span
              className="w-fit rounded-full px-4 py-2 font-mono text-sm font-semibold shadow-lg"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#10B981",
                boxShadow: "0 0 20px rgba(16,185,129,0.2)",
              }}
            >
              {data.financial.tickerSymbol}
            </span>
          )}
        </motion.div>

        {/* ── Loading ── */}
        {status === "loading" && <LoadingState companyName={companyName} />}

        {/* ── Error ── */}
        {status === "error" && (
          <div
            className="card p-8"
            style={{ borderColor: "rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.06)" }}
          >
            <p className="mb-2 font-semibold" style={{ color: "#EF4444" }}>
              Analysis failed
            </p>
            <p className="text-sm text-muted">{errorMsg}</p>
          </div>
        )}

        {/* ── Results ── */}
        {status === "success" && data && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <div className="flex flex-col gap-6 lg:col-span-2">
              {data.research && (
                <CompanyOverviewCard research={data.research} financial={data.financial} />
              )}
              {data.research && <ResearchSummaryCard research={data.research} />}
              {data.financial?.isPublic && (
                <StockPerformanceGraph symbol={data.financial.tickerSymbol} />
              )}
              {data.financial && <FinancialAnalysisCard financial={data.financial} />}
              {data.risk && <RiskAnalysisCard risk={data.risk} />}
            </div>

            <div className="lg:col-span-1">
              {data.decision && <DecisionCard decision={data.decision} />}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
