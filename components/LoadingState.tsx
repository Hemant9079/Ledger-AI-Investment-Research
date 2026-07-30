"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.5" y1="16.5" x2="22" y2="22" />
  </svg>
);
const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="7" width="4" height="14" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3L2 21h20L12 3z" />
    <line x1="12" y1="10" x2="12" y2="14" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const STEPS = [
  { agent: "Research Agent", Icon: SearchIcon,     desc: "Gathering company background and news" },
  { agent: "Financial Agent", Icon: BarChartIcon,  desc: "Pulling live market data and financials" },
  { agent: "Risk Agent",      Icon: AlertIcon,     desc: "Scanning competitive and market risks" },
  { agent: "Decision Agent",  Icon: CheckCircleIcon, desc: "Weighing evidence for final verdict" },
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
    <section className="card relative overflow-hidden p-8 sm:p-12">

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-border bg-surface2 shadow-sm">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-invest"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Analyzing{" "}
          <span className="text-invest">{companyName}</span>
        </h2>

        <AnimatePresence mode="wait">
          {(() => {
            const ActiveIcon = STEPS[stepIndex].Icon;
            return (
              <motion.p
                key={stepIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="mt-3 font-mono text-sm flex items-center justify-center gap-2 text-invest/80"
              >
                <ActiveIcon />{STEPS[stepIndex].desc}
              </motion.p>
            );
          })()}
        </AnimatePresence>

        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-surface2 border border-border">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full progress-bar"
          />
        </div>

        <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.agent}
              animate={{
                opacity: index <= stepIndex ? 1 : 0.35,
                y: index === stepIndex ? -4 : 0,
              }}
              className={`rounded-xl p-3 text-left transition-all border ${index === stepIndex ? 'border-invest bg-invest/5' : 'border-border bg-surface'}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted">Agent {index + 1}</div>
                {index <= stepIndex && (
                  <div className={`h-1.5 w-1.5 rounded-full ${index < stepIndex ? 'bg-invest' : 'bg-invest/60'}`} />
                )}
              </div>
              <div className={`mt-1.5 flex items-center ${index <= stepIndex ? 'text-invest' : 'text-muted/40'}`}>
                {(() => { const SI = step.Icon; return <SI />; })()}
              </div>
              <div className="mt-1 text-xs leading-5 text-muted">{step.agent}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
