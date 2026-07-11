import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#020617",
        surface: "rgba(15, 23, 42, 0.72)",
        surface2: "rgba(17, 24, 39, 0.82)",
        border: "rgba(148, 163, 184, 0.18)",
        muted: "#94A3B8",
        ink: "#F8FAFC",
        invest: "#10B981",
        pass: "#EF4444",
        watch: "#FBBF24",
        brand: "#3B82F6",
        ai: "#8B5CF6"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
