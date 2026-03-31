import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6b38d4",
        secondary: "#a43073",
        tertiary: "#006387",
        background: "#f7f9ff",
        surface: "#f7f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#edf4ff",
        "surface-container": "#e4effd",
        "surface-container-high": "#dfe9f7",
        "surface-container-highest": "#d9e3f1",
        "primary-fixed": "#e9ddff",
        "secondary-fixed": "#ffd8e7",
        "tertiary-fixed": "#c4e7ff",
        "on-surface": "#121d26",
        "on-surface-variant": "#5c6470",
        "outline-variant": "#cbc3d7"
      },
      fontFamily: {
        heading: ["var(--font-plus-jakarta)", "sans-serif"],
        sans: ["var(--font-manrope)", "sans-serif"]
      },
      borderRadius: {
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem"
      },
      boxShadow: {
        float: "0 20px 40px -12px rgba(18, 29, 38, 0.08)",
        glow: "0 20px 40px -12px rgba(107, 56, 212, 0.24)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #8b5cf6, #f472b6)"
      }
    }
  },
  plugins: []
};

export default config;
