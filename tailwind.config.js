/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./components/**/*.html",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2f8",
          100: "#d7e0ee",
          200: "#aec0dd",
          300: "#7f9bc7",
          400: "#4e6ea3",
          500: "#2f4d80",
          600: "#1e3760",
          700: "#152847",
          800: "#0f1d34",
          900: "#0a1526",
          950: "#060d18",
        },
        slate: {
          450: "#7c8aa0",
        },
        accent: {
          DEFAULT: "#2563eb",
          light: "#5b8bf5",
          dark: "#1d4ed8",
        },
        surface: {
          light: "#f4f6f8",
          dark: "#0f1a2b",
        },
        ink: {
          DEFAULT: "#1e293b",
          soft: "#475569",
        },
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 8px 24px -8px rgb(15 23 42 / 0.10)",
        "soft-lg": "0 20px 50px -20px rgb(15 23 42 / 0.25)",
        "soft-dark": "0 20px 50px -20px rgb(0 0 0 / 0.5)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: 1 },
          "50%, 100%": { opacity: 0 },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "fade-up": "fade-up 0.7s ease forwards",
        marquee: "marquee 28s linear infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
