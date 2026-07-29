import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#030712",
        surface: "rgba(10, 20, 14, 0.75)",
        surface2: "rgba(12, 24, 16, 0.88)",
        border: "rgba(16, 185, 129, 0.14)",
        muted: "#6B7280",
        ink: "#F9FAFB",
        invest: "#10B981",
        pass: "#EF4444",
        watch: "#FBBF24",
        brand: "#10B981",
        ai: "#34D399",
        accent: "#059669"
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"]
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 8s linear infinite",
        "ticker": "ticker-scroll 34s linear infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "orbit": "orbit 20s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        "ticker-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        orbit: {
          from: { transform: "rotate(0deg) translateX(180px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(180px) rotate(-360deg)" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(16, 185, 129, 0.2)",
        "glow-md": "0 0 40px rgba(16, 185, 129, 0.3)",
        "glow-lg": "0 0 80px rgba(16, 185, 129, 0.4)",
        "glow-invest": "0 0 30px rgba(16, 185, 129, 0.35)",
        "glow-pass": "0 0 30px rgba(239, 68, 68, 0.35)",
      },
    }
  },
  plugins: []
};

export default config;
