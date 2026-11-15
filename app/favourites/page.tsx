"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";

const FAVOURITES_KEY = "ledger_favourites";

interface FavouriteEntry {
  company: string;
  tickerSymbol: string | null;
  addedAt: string;
  lastPrice?: number;
  lastChecked?: string;
}

function getFavourites(): FavouriteEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAVOURITES_KEY) ?? "[]"); } catch { return []; }
}

function saveFavourites(entries: FavouriteEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(entries));
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function FavouritesPage() {
  const router = useRouter();
  const auth = useAuth();
  const [favourites, setFavourites] = useState<FavouriteEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      router.replace("/login");
      return;
    }
    setFavourites(getFavourites());
    setHydrated(true);
  }, [auth.isLoggedIn, router]);

  function removeFavourite(company: string) {
    const updated = favourites.filter((f) => f.company.toLowerCase() !== company.toLowerCase());
    saveFavourites(updated);
    setFavourites(updated);
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
            <span className="font-mono text-xs tracking-widest uppercase text-muted">Favourites</span>
          </div>

          <div className="flex items-center gap-3">
            {auth.isLoggedIn && auth.user && (
              <>
                <Link href="/history" className="hidden font-mono text-[11px] text-muted transition-colors hover:text-invest sm:block">History</Link>
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

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Favourites</h1>
          <p className="mt-1 font-mono text-xs text-muted">
            {favourites.length} {favourites.length === 1 ? "company" : "companies"} tracked
          </p>
        </div>

        {/* Empty state */}
        {favourites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card flex flex-col items-center justify-center py-24 text-center"
          >
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.15)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-ink">No favourites yet</h2>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Star any company during analysis to track it here.
            </p>
            <Link
              href="/"
              className="btn-neon mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold tracking-wider"
            >
              Start Researching
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {favourites.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {favourites.map((fav, i) => (
                <motion.div
                  key={fav.company}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="card relative overflow-hidden p-6"
                >
                  {/* Top accent */}
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(217,119,6,0.4), transparent)" }}
                  />

                  {/* Company name + ticker */}
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-ink">{fav.company}</h3>
                      {fav.tickerSymbol && (
                        <span
                          className="mt-1 inline-block rounded-full px-2 py-0.5 font-mono text-[10px]"
                          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10B981" }}
                        >
                          {fav.tickerSymbol}
                        </span>
                      )}
                    </div>
                    {/* Star icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>

                  {/* Last price */}
                  {fav.lastPrice !== undefined && (
                    <div className="mt-3 font-mono text-xl font-bold text-ink">
                      ${fav.lastPrice.toFixed(2)}
                      <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-muted">last price</span>
                    </div>
                  )}

                  {/* Tracking since */}
                  <p className="mt-3 font-mono text-[11px]" style={{ color: "rgba(161,161,170,0.6)" }}>
                    Tracking since {formatDate(fav.addedAt)}
                  </p>

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/analyze/${encodeURIComponent(fav.company)}`}
                      className="btn-neon flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold tracking-wider"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="22" y2="22" />
                      </svg>
                      Re-analyze
                    </Link>
                    <button
                      onClick={() => removeFavourite(fav.company)}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-pass/20 bg-pass/5 px-3 py-2 font-mono text-xs text-pass transition-colors hover:bg-pass/10"
                      title="Remove from favourites"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
