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
      <div className="pointer-events-none absolute inset-0 premium-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full bg-brand/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-64 h-96 w-96 rounded-full bg-ai/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/60 px-4 py-3 backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-ink"
          >
            <span className="text-brand">Back</span>
            New search
          </Link>
          <span className="label-eyebrow">Investment Research Dashboard</span>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="label-eyebrow text-brand">Company Intelligence</span>
            <h1 className="mt-2 font-display text-4xl leading-tight md:text-6xl">
              {companyName}
            </h1>
          </div>
          {data?.financial?.tickerSymbol && (
            <span className="w-fit rounded-full border border-brand/30 bg-brand/10 px-4 py-2 font-mono text-sm text-brand shadow-lg shadow-brand/10">
              {data.financial.tickerSymbol}
            </span>
          )}
        </motion.div>

        {status === "loading" && <LoadingState companyName={companyName} />}

        {status === "error" && (
          <div className="card border-pass/40 p-8">
            <p className="mb-2 font-medium text-pass">Analysis failed</p>
            <p className="text-sm text-muted">{errorMsg}</p>
          </div>
        )}

        {status === "success" && data && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <div className="flex flex-col gap-6 lg:col-span-2">
              {data.research && (
                <CompanyOverviewCard
                  research={data.research}
                  financial={data.financial}
                />
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
