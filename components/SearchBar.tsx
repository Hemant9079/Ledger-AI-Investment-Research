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
        animate={{
          boxShadow: focused
            ? "0 0 60px rgba(16,185,129,0.35), 0 0 120px rgba(16,185,129,0.1)"
            : "0 0 20px rgba(16,185,129,0.1)",
        }}
        transition={{ duration: 0.3 }}
        className="relative flex flex-col gap-3 overflow-hidden rounded-2xl p-2 sm:flex-row"
        style={{
          background: "rgba(10, 20, 14, 0.75)",
          border: `1px solid ${focused ? "rgba(16,185,129,0.5)" : "rgba(16,185,129,0.2)"}`,
          backdropFilter: "blur(24px)",
          transition: "border-color 0.3s ease",
        }}
      >
        {/* Top gradient line */}
        <div
          className="pointer-events-none absolute inset-x-8 top-0 h-px"
          style={{
            background: focused
              ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.9), transparent)"
              : "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)",
            transition: "all 0.3s ease",
          }}
        />

        {/* Input area */}
        <div
          className="flex flex-1 items-center gap-3 rounded-xl px-4 py-2"
          style={{ background: "rgba(3, 7, 18, 0.4)" }}
        >
          {/* AI badge */}
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, rgba(5,150,105,0.3), rgba(16,185,129,0.2))",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#10B981",
              boxShadow: "0 0 12px rgba(16,185,129,0.2)",
            }}
          >
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

        {/* Submit button */}
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

      {/* Example chips */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="mr-1 font-mono text-[11px] text-muted/60">Try:</span>
        {EXAMPLES.map((name) => (
          <motion.button
            key={name}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/analyze/${encodeURIComponent(name)}`)}
            className="rounded-full px-3 py-1 font-mono text-xs transition-all duration-200"
            style={{
              border: "1px solid rgba(16,185,129,0.2)",
              background: "rgba(16,185,129,0.06)",
              color: "rgba(16,185,129,0.7)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(16,185,129,0.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "#10B981";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 12px rgba(16,185,129,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(16,185,129,0.2)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "rgba(16,185,129,0.7)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            {name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
