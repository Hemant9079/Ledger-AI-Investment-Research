"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";

const HISTORY_KEY = "ledger_search_history";

interface SearchHistoryEntry {
  company: string;
  timestamp: string;
  decision?: string;
  confidenceScore?: number;
}

function getHistory(): SearchHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function HistoryPage() {
  const router = useRouter();
  const auth = useAuth();
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      router.replace("/login");
      return;
    }
    setHistory(getHistory());
    setHydrated(true);
  }, [auth.isLoggedIn, router]);

  function clearHistory() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(HISTORY_KEY);
    }
    setHistory([]);
  }

  if (!hydrated || !auth.isLoggedIn) return null;

  return (
    <main className="relative min-h-screen">
      {/* Nav */}
      <nav className="nav-bar sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex flex-col leading-none transition-opacity hover:opacity-80">
              <span className="font-mono text-[13px] font-black tracking-[0.18em] uppercase text-ink">Ledger</span>
              <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-invest/80">Intelligence</span>
            </Link>
            <span className="text-border">│</span>
            <span className="font-mono text-xs tracking-widest uppercase text-muted">Search History</span>
          </div>

          <div className="flex items-center gap-3">
            {auth.isLoggedIn && auth.user && (
              <>
                <Link href="/favourites" className="hidden font-mono text-[11px] text-muted transition-colors hover:text-invest sm:block">Favourites</Link>
                <button
                  onClick={() => { auth.logout(); router.push("/"); }}
                  className="hidden font-mono text-[11px] text-muted transition-colors hover:text-pass sm:block"
                >
                  Sign Out
                </button>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold"
                  style={{ background: "linear-gradient(135deg,#059669,#10B981)", color: "#030712" }}
                  title={auth.user.name}
                >
                  {auth.user.name.charAt(0).toUpperCase()}
                </div>
              </>
            )}
            <Link
              href="/"
              className="flex items-center gap-1.5 font-mono text-[11px] transition-colors"
              style={{ color: "rgba(16,185,129,0.7)" }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              New Search
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">Search History</h1>
            <p className="mt-1 font-mono text-xs text-muted">
              {history.length} {history.length === 1 ? "analysis" : "analyses"} recorded
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 rounded-xl border border-pass/20 bg-pass/5 px-4 py-2 font-mono text-xs text-pass transition-colors hover:bg-pass/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
              Clear History
            </button>
          )}
        </div>

        {/* Empty state */}
        {history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-center justify-center py-24 text-center"
          >
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-ink">No searches yet</h2>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Your company analyses will appear here. Start by searching for a stock.
            </p>
            <Link
              href="/"
              className="btn-neon mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold tracking-wider"
            >
              Start Researching
            </Link>
          </motion.div>
        )}

        {/* History list */}
        {history.length > 0 && (
          <AnimatePresence>
            <div className="space-y-3">
              {history.map((entry, i) => {
                const isInvest = entry.decision === "INVEST";
                const isPass = entry.decision === "PASS";
                return (
                  <motion.div
                    key={`${entry.company}-${entry.timestamp}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={`/analyze/${encodeURIComponent(entry.company)}`}
                      className="card group flex items-center gap-4 p-5 transition-all duration-200 hover:border-invest/40"
                    >
                      {/* Icon */}
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: isInvest
                            ? "rgba(16,185,129,0.1)"
                            : isPass
                            ? "rgba(239,68,68,0.1)"
                            : "rgba(255,255,255,0.04)",
                          border: isInvest
                            ? "1px solid rgba(16,185,129,0.25)"
                            : isPass
                            ? "1px solid rgba(239,68,68,0.25)"
                            : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isInvest ? "#10B981" : isPass ? "#EF4444" : "#a1a1aa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="7" />
                          <line x1="16.5" y1="16.5" x2="22" y2="22" />
                        </svg>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-ink group-hover:text-invest transition-colors">
                            {entry.company}
                          </span>
                          {entry.decision && (
                            <span
                              className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                              style={{
                                background: isInvest ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                border: `1px solid ${isInvest ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                                color: isInvest ? "#10B981" : "#EF4444",
                              }}
                            >
                              {entry.decision}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 font-mono text-[11px] text-muted">
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>

                      {/* Confidence */}
                      {entry.confidenceScore !== undefined && (
                        <div className="hidden shrink-0 flex-col items-end sm:flex">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Confidence</span>
                          <span
                            className="mt-0.5 font-mono text-lg font-bold"
                            style={{ color: isInvest ? "#10B981" : isPass ? "#EF4444" : "#a1a1aa" }}
                          >
                            {entry.confidenceScore}%
                          </span>
                        </div>
                      )}

                      {/* Arrow */}
                      <svg
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
