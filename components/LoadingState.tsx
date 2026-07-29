"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { agent: "Research Agent", icon: "🔍", desc: "Gathering company background and news" },
  { agent: "Financial Agent", icon: "📊", desc: "Pulling live market data and financials" },
  { agent: "Risk Agent", icon: "⚠️", desc: "Scanning competitive and market risks" },
  { agent: "Decision Agent", icon: "✅", desc: "Weighing evidence for final verdict" },
];

export default function LoadingState({ companyName }: { companyName: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + 0.4, 95));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="card scan-sheen relative overflow-hidden p-8 sm:p-12"
      style={{ borderColor: "rgba(16,185,129,0.2)" }}
    >
      {/* Top glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.8), transparent)",
        }}
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Animated icon */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div
            className="absolute -inset-3 rounded-full"
            style={{
              border: "1px solid rgba(16,185,129,0.2)",
              animation: "glow-pulse 2s ease-in-out infinite",
            }}
          />
          {/* Inner spinner */}
          <div
            className="relative grid h-20 w-20 place-items-center rounded-2xl"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.3)",
              boxShadow: "0 0 40px rgba(16,185,129,0.2)",
            }}
          >
            <div
              className="h-10 w-10 animate-spin rounded-full border-2"
              style={{
                borderColor: "rgba(16,185,129,0.2)",
                borderTopColor: "#10B981",
                boxShadow: "0 0 12px rgba(16,185,129,0.4)",
              }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Analyzing{" "}
          <span style={{ color: "#10B981" }}>{companyName}</span>
        </h2>

        {/* Active step label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-3 font-mono text-sm"
            style={{ color: "rgba(16,185,129,0.75)" }}
          >
            {STEPS[stepIndex].icon} {STEPS[stepIndex].desc}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div
          className="mt-8 h-1 w-full overflow-hidden rounded-full"
          style={{ background: "rgba(16,185,129,0.1)" }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full progress-bar"
          />
        </div>

        {/* Steps grid */}
        <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.agent}
              animate={{
                opacity: index <= stepIndex ? 1 : 0.35,
                y: index === stepIndex ? -4 : 0,
              }}
              className="rounded-xl p-3 text-left transition-all"
              style={{
                background:
                  index === stepIndex
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(10,20,14,0.6)",
                border:
                  index === stepIndex
                    ? "1px solid rgba(16,185,129,0.4)"
                    : "1px solid rgba(16,185,129,0.1)",
                boxShadow:
                  index === stepIndex
                    ? "0 0 20px rgba(16,185,129,0.15)"
                    : "none",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="label-eyebrow">Agent {index + 1}</div>
                {index <= stepIndex && (
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        index < stepIndex ? "#10B981" : "rgba(16,185,129,0.6)",
                      boxShadow:
                        index === stepIndex
                          ? "0 0 8px rgba(16,185,129,0.8)"
                          : "none",
                      animation: index === stepIndex ? "glow-pulse 1.5s ease-in-out infinite" : "none",
                    }}
                  />
                )}
              </div>
              <div className="mt-1.5 text-sm">{step.icon}</div>
              <div className="mt-1 text-xs leading-5 text-muted">{step.agent}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
