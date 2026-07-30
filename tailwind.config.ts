import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#09090b",
        surface: "#18181b",
        surface2: "#27272a",
        border: "#27272a",
        muted: "#a1a1aa",
        ink: "#fafafa",
        invest: "#16a34a",
        pass: "#dc2626",
        watch: "#d97706",
        brand: "#16a34a",
        ai: "#22c55e",
        accent: "#15803d"
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"]
      },
      boxShadow: {
        "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }
    }
  },
  plugins: []
};

export default config;
