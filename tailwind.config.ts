import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#181819",
          soft: "#2B2B2D",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          dim: "#F7F6FA",
        },
        graphite: {
          DEFAULT: "#5D5C63",
          light: "#8B8A92",
        },
        line: "#E8E7ED",
        "line-dark": "#333336",
      },
      fontFamily: {
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        wide2: "0.12em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(24,24,25,0.04), 0 8px 24px -12px rgba(24,24,25,0.10)",
        "card-hover": "0 2px 4px rgba(24,24,25,0.06), 0 16px 32px -12px rgba(24,24,25,0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
