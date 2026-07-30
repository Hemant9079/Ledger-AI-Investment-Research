"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EXAMPLES = ["Nvidia", "Tesla", "Zomato", "Infosys", "Apple"];

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/analyze/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="w-full">
      <motion.form
        onSubmit={handleSubmit}
        className={`relative flex flex-col gap-3 overflow-hidden rounded-2xl p-2 sm:flex-row border bg-surface transition-colors duration-300 ${focused ? 'border-invest' : 'border-border'}`}
      >

        <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-2 bg-surface2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold bg-invest/10 border border-invest/20 text-invest">
            AI
          </span>

          <input
            id="company-search-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search any company — Nvidia, Zomato, Apple..."
            className="min-h-12 flex-1 bg-transparent text-base text-ink placeholder:text-muted/60 focus:outline-none"
            aria-label="Company name or stock ticker"
            autoComplete="off"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          id="analyze-submit-button"
          className="btn-neon rounded-xl px-8 py-4 text-sm tracking-wide"
          style={{ color: "#030712" }}
        >
          Analyze →
        </motion.button>
      </motion.form>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="mr-1 font-mono text-[11px] text-muted/60">Try:</span>
        {EXAMPLES.map((name) => (
          <button
            key={name}
            onClick={() => router.push(`/analyze/${encodeURIComponent(name)}`)}
            className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-invest hover:text-invest"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
