import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        accent: "#15803d",
        "inverse-primary": "#006e2f",
        "on-tertiary-fixed": "#410001",
        "tertiary-fixed": "#ffdad5",
        "error-container": "#93000a",
        "error": "#ffb4ab",
        "outline-variant": "#3d4a3d",
        "on-error-container": "#ffdad6",
        "on-background": "#e2e2e2",
        "outline": "#869585",
        "surface-container": "#1f1f1f",
        "surface-dim": "#131313",
        "on-secondary-fixed-variant": "#005236",
        "inverse-on-surface": "#303030",
        "secondary-fixed-dim": "#4edea3",
        "secondary-fixed": "#6ffbbe",
        "secondary": "#4edea3",
        "on-primary-container": "#004b1e",
        "surface-container-highest": "#353535",
        "on-surface": "#e2e2e2",
        "surface-bright": "#393939",
        "on-tertiary-container": "#76231b",
        "on-surface-variant": "#bccbb9",
        "background": "#131313",
        "tertiary-container": "#ff8b7c",
        "primary": "#4be277",
        "on-error": "#690005",
        "on-primary-fixed-variant": "#005321",
        "tertiary": "#ffb5ab",
        "surface-container-lowest": "#0e0e0e",
        "on-secondary": "#003824",
        "surface-variant": "#353535",
        "primary-container": "#22c55e",
        "inverse-surface": "#e2e2e2",
        "surface-container-high": "#2a2a2a",
        "on-secondary-fixed": "#002113",
        "surface-container-low": "#1b1b1b",
        "on-primary": "#003915",
        "surface-tint": "#4ae176",
        "tertiary-fixed-dim": "#ffb4a9",
        "on-tertiary": "#60130d",
        "on-secondary-container": "#00311f",
        "primary-fixed": "#6bff8f",
        "secondary-container": "#00a572",
        "primary-fixed-dim": "#4ae176",
        "on-tertiary-fixed-variant": "#7f2a21",
        "on-primary-fixed": "#002109"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "section-gap": "80px",
        "margin-desktop": "40px",
        "container-max": "1280px",
        "margin-mobile": "16px",
        "gutter": "24px",
        "unit": "4px"
      },
      fontFamily: {
        "headline-md": ["Geist", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Geist", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg": ["Geist", "sans-serif"],
        "display-lg": ["Geist", "sans-serif"],
        "label-md": ["JetBrains Mono", "monospace"],
        "label-sm": ["JetBrains Mono", "monospace"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"]
      },
      fontSize: {
        "headline-md": ["32px", { "lineHeight": "1.3", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "headline-lg-mobile": ["30px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
        "headline-lg": ["40px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "display-lg": ["64px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "label-md": ["14px", { "lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "500" }],
        "label-sm": ["12px", { "lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "500" }]
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
