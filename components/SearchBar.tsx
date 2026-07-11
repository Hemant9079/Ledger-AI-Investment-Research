"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EXAMPLES = ["Nvidia", "Tesla", "Zomato", "Infosys", "Apple"];

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/analyze/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="glass-panel relative flex flex-col gap-3 overflow-hidden rounded-2xl p-2 sm:flex-row"
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand/80 to-transparent" />
        <div className="flex flex-1 items-center gap-3 rounded-xl bg-base/35 px-4 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand/25 to-ai/25 text-sm font-semibold text-brand">
            AI
          </span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask AI to analyze any company..."
            className="min-h-12 flex-1 bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
            aria-label="Company name"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="rounded-xl bg-gradient-to-r from-brand to-ai px-7 py-4 font-semibold text-white shadow-lg shadow-brand/20 transition-opacity hover:opacity-95"
        >
          Analyze
        </motion.button>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((name) => (
          <motion.button
            key={name}
            whileHover={{ y: -2 }}
            onClick={() => router.push(`/analyze/${encodeURIComponent(name)}`)}
            className="rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-brand/60 hover:text-ink"
          >
            {name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
