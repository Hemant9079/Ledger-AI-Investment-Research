"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STEPS = [
  "Research Agent gathering company background and news",
  "Financial Agent pulling market data",
  "Risk Agent scanning competitive and market risks",
  "Decision Agent weighing the final verdict",
];

export default function LoadingState({ companyName }: { companyName: string }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((index) => (index + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="card relative overflow-hidden p-8 sm:p-10">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand/80 to-transparent" />
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="relative grid h-20 w-20 place-items-center rounded-3xl border border-brand/30 bg-brand/10 shadow-2xl shadow-brand/20">
          <div className="absolute inset-0 rounded-3xl border border-ai/20 animate-ping" />
          <div className="h-9 w-9 rounded-full border-2 border-border border-t-brand animate-spin" />
        </div>

        <p className="mt-6 font-display text-2xl md:text-3xl">
          Analyzing {companyName}
        </p>
        <p className="mt-3 font-mono text-sm text-muted">{STEPS[stepIndex]}</p>

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step}
              animate={{
                opacity: index === stepIndex ? 1 : 0.55,
                y: index === stepIndex ? -4 : 0,
              }}
              className={`rounded-xl border p-3 text-left ${
                index === stepIndex
                  ? "border-brand/40 bg-brand/10"
                  : "border-border bg-surface2"
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Agent {index + 1}
              </div>
              <div className="mt-2 text-xs leading-5 text-ink">{step}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
