"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentState } from "@/agents/state";
import LoadingState from "@/components/LoadingState";
import { useAuth } from "@/lib/auth";

import ResearchTab from "@/components/tabs/ResearchTab";
import FinancialsTab from "@/components/tabs/FinancialsTab";
import RiskTab from "@/components/tabs/RiskTab";
import DecisionTab from "@/components/tabs/DecisionTab";
import SummaryTab from "@/components/tabs/SummaryTab";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

type Status = "loading" | "success" | "error";
type TabId = "research" | "financials" | "risk" | "decision" | "summary";

export interface SearchHistoryEntry {
  company: string;
  timestamp: string;
  decision?: string;
  confidenceScore?: number;
}

export interface FavouriteEntry {
  company: string;
  tickerSymbol: string | null;
  addedAt: string;
  lastPrice?: number;
  lastChecked?: string;
}

const HISTORY_KEY = "ledger_search_history";
const FAVOURITES_KEY = "ledger_favourites";
const MAX_HISTORY = 50;

/* ------------------------------------------------------------------ */
/*  localStorage helpers                                                */
/* ------------------------------------------------------------------ */

function getHistory(): SearchHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}

function saveHistory(entries: SearchHistoryEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

function getFavourites(): FavouriteEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAVOURITES_KEY) ?? "[]"); } catch { return []; }
}

function saveFavourites(entries: FavouriteEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(entries));
}

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                     */
/* ------------------------------------------------------------------ */

const TAB_ICONS: Record<TabId, JSX.Element> = {
  research: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  ),
  financials: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  ),
  risk: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L2 21h20L12 3z" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  ),
  decision: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  summary: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  ),
};

const TABS: { id: TabId; label: string; description: string }[] = [
  { id: "research",   label: "Research",   description: "Company profile, news & sentiment" },
  { id: "financials", label: "Financials", description: "Stock data & financial health"      },
  { id: "risk",       label: "Risk",       description: "Competitive & regulatory risks"    },
  { id: "decision",   label: "Decision",   description: "Final verdict & confidence score"  },
  { id: "summary",    label: "Summary",    description: "Consolidated full report"          },
];

/* ------------------------------------------------------------------ */
/*  Star button                                                          */
/* ------------------------------------------------------------------ */

function StarButton({
  company,
  tickerSymbol,
  lastPrice,
}: {
  company: string;
  tickerSymbol?: string | null;
  lastPrice?: number;
}) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = getFavourites();
    setIsFav(favs.some((f) => f.company.toLowerCase() === company.toLowerCase()));
  }, [company]);

  function toggle() {
    const favs = getFavourites();
    const idx = favs.findIndex((f) => f.company.toLowerCase() === company.toLowerCase());
    if (idx >= 0) {
      favs.splice(idx, 1);
      setIsFav(false);
    } else {
      favs.unshift({
        company,
        tickerSymbol: tickerSymbol ?? null,
        addedAt: new Date().toISOString(),
        lastPrice,
        lastChecked: new Date().toISOString(),
      });
      setIsFav(true);
    }
    saveFavourites(favs);
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      title={isFav ? "Remove from favourites" : "Add to favourites"}
      className="flex items-center justify-center rounded-lg p-1.5 transition-colors duration-200"
      style={{
        background: isFav ? "rgba(217,119,6,0.12)" : "rgba(255,255,255,0.04)",
        border: isFav ? "1px solid rgba(217,119,6,0.3)" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isFav ? "#D97706" : "none"}
        stroke={isFav ? "#D97706" : "rgba(156,163,175,0.6)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function AnalyzePage({ params }: { params: { company: string } }) {
  const companyName = decodeURIComponent(params.company);
  const router = useRouter();
  const auth = useAuth();

  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<AgentState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabId>("research");
  const [retryCount, setRetryCount] = useState(0);
  const [now, setNow] = useState("");

  // Clock
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Save to history after success
  const saveToHistory = useCallback((result: AgentState) => {
    const entry: SearchHistoryEntry = {
      company: companyName,
      timestamp: new Date().toISOString(),
      decision: result.decision?.decision,
      confidenceScore: result.decision?.confidenceScore,
    };
    const history = getHistory();
    // Remove any existing entry for the same company
    const filtered = history.filter((h) => h.company.toLowerCase() !== companyName.toLowerCase());
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
    saveHistory(updated);
  }, [companyName]);

  // Fetch analysis
  useEffect(() => {
    let cancelled = false;
    setErrorMsg("");
    async function run() {
      setStatus("loading");
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyName }),
        });

        const text = await res.text();
        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          if (res.status === 504 || text.includes("FUNCTION_INVOCATION_TIMEOUT")) {
            throw new Error("Analysis timed out on the server. Please try again.");
          }
          throw new Error(text || `Analysis failed with status code ${res.status}`);
        }

        if (!res.ok) throw new Error(json?.error ?? "Analysis failed.");
        if (cancelled) return;
        setData(json);
        setStatus("success");
        saveToHistory(json);
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err?.message ?? "Something went wrong.");
        setStatus("error");
      }
    }
    run();
    return () => { cancelled = true; };
  }, [companyName, retryCount, saveToHistory]);

  const isInvest = data?.decision?.decision === "INVEST";
  const accentColor = data?.decision
    ? isInvest ? "#10B981" : "#EF4444"
    : "#10B981";

  return (
    <main className="relative min-h-screen overflow-hidden">

      <nav className="nav-bar sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Left: logo + company info */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex flex-col leading-none transition-opacity hover:opacity-80">
              <span className="font-mono text-[13px] font-black tracking-[0.18em] uppercase text-ink">
                Ledger
              </span>
              <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-invest/80">
                Intelligence
              </span>
            </Link>

            <span className="text-border">│</span>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{companyName}</span>
              {data?.financial?.tickerSymbol && (
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}
                >
                  {data.financial.tickerSymbol}
                </span>
              )}
              {data?.decision && (
                <span
                  className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    background: isInvest ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${isInvest ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    color: accentColor,
                  }}
                >
                  ● {data.decision.decision}
                </span>
              )}
            </div>
          </div>

          {/* Right: star + auth + new search */}
          <div className="flex items-center gap-3">
            {now && (
              <span className="hidden font-mono text-[10px] sm:block" style={{ color: "rgba(156,163,175,0.4)" }}>
                {now} UTC
              </span>
            )}

            {/* Star button — only show when analysis loaded */}
            {status === "success" && data && (
              <StarButton
                company={companyName}
                tickerSymbol={data.financial?.tickerSymbol}
                lastPrice={data.financial?.currentPrice ?? undefined}
              />
            )}

            {/* Auth nav items */}
            {auth.isLoggedIn && auth.user ? (
              <>
                <Link
                  href="/history"
                  className="hidden font-mono text-[11px] text-muted transition-colors hover:text-invest sm:block"
                >
                  History
                </Link>
                <Link
                  href="/favourites"
                  className="hidden font-mono text-[11px] text-muted transition-colors hover:text-invest sm:block"
                >
                  Favourites
                </Link>
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
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden font-mono text-[11px] text-muted transition-colors hover:text-invest sm:block"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="hidden rounded-full px-3 py-1 font-mono text-[10px] font-bold tracking-wider sm:block"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}
                >
                  Sign Up
                </Link>
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

        {status === "success" && (
          <div className="border-t border-border px-4 sm:px-6">
            <div className="mx-auto flex max-w-7xl gap-0 overflow-x-auto">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className="group relative flex items-center gap-2 px-5 py-3.5 font-mono text-xs tracking-wider transition-all duration-200 whitespace-nowrap"
                    style={{
                      color: isActive ? "theme('colors.invest')" : "theme('colors.muted')",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <span className="flex items-center">{TAB_ICONS[tab.id]}</span>
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute inset-x-0 bottom-0 h-[2px] bg-invest rounded-t-md"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {!isActive && (
                      <div className="absolute inset-x-0 bottom-0 h-px bg-invest opacity-0 transition-opacity group-hover:opacity-40" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {status === "loading" && <LoadingState companyName={companyName} />}

        {status === "error" && (
          <div className="card border-pass/30 bg-pass/5 p-8">
            <p className="mb-2 font-semibold text-pass">Analysis Encountered an Issue</p>
            <p className="text-sm text-muted mb-4">{errorMsg}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setRetryCount((c) => c + 1)}
                className="btn-neon rounded-xl px-5 py-2 text-xs font-mono font-bold tracking-wider"
              >
                Retry Analysis
              </button>
              <Link
                href="/"
                className="rounded-xl border border-border bg-surface px-5 py-2 text-xs font-mono text-muted hover:text-ink transition-colors"
              >
                Back to Search
              </Link>
            </div>
          </div>
        )}

        {status === "success" && data && (
          <AnimatePresence mode="wait">
            {activeTab === "research" && (
              <motion.div key="research" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {data.research ? (
                  <ResearchTab research={data.research} financial={data.financial} decision={data.decision} />
                ) : (
                  <EmptyAgent label="Research Agent" />
                )}
              </motion.div>
            )}

            {activeTab === "financials" && (
              <motion.div key="financials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {data.financial ? (
                  <FinancialsTab financial={data.financial} />
                ) : (
                  <EmptyAgent label="Financial Agent" />
                )}
              </motion.div>
            )}

            {activeTab === "risk" && (
              <motion.div key="risk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {data.risk ? (
                  <RiskTab risk={data.risk} research={data.research} />
                ) : (
                  <EmptyAgent label="Risk Agent" />
                )}
              </motion.div>
            )}

            {activeTab === "decision" && (
              <motion.div key="decision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {data.decision ? (
                  <DecisionTab decision={data.decision} research={data.research} financial={data.financial} risk={data.risk} />
                ) : (
                  <EmptyAgent label="Decision Agent" />
                )}
              </motion.div>
            )}

            {activeTab === "summary" && (
              <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <SummaryTab data={data} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}

function EmptyAgent({ label }: { label: string }) {
  return (
    <div className="card flex flex-col items-center justify-center py-20 text-center border-border bg-surface2">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border text-muted">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      </div>
      <p className="font-semibold text-ink">{label}</p>
      <p className="mt-2 text-sm text-muted">
        No data returned from this agent.
      </p>
    </div>
  );
}
