import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Monochrome surface system
        surface: {
          0:   "#ffffff",
          50:  "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        // Kanban columns — monochrome shades
        applied: {
          DEFAULT: "#374151",
          bg:      "#f9fafb",
          border:  "#e5e7eb",
          text:    "#111827",
        },
        interview: {
          DEFAULT: "#1f2937",
          bg:      "#f3f4f6",
          border:  "#d1d5db",
          text:    "#111827",
        },
        rejected: {
          DEFAULT: "#6b7280",
          bg:      "#f9fafb",
          border:  "#e5e7eb",
          text:    "#6b7280",
        },
        offer: {
          DEFAULT: "#111827",
          bg:      "#f9fafb",
          border:  "#374151",
          text:    "#111827",
        },
        // Fraud — ONLY accent color retained
        fraud: {
          DEFAULT: "#dc2626",
          light:   "#fef2f2",
          border:  "#fecaca",
          text:    "#dc2626",
          dark:    "#b91c1c",
        },
      },
      animation: {
        "slide-in-right": "slideInRight 0.3s ease-out",
        "fade-in":         "fadeIn 0.2s ease-out",
        "fraud-pulse":     "fraudPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer:           "shimmer 1.5s infinite",
      },
      keyframes: {
        slideInRight: {
          "0%":   { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)",    opacity: "1" },
        },
        fadeIn: {
          "0%":   { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        fraudPulse: {
          "0%, 100%": { borderColor: "#dc2626" },
          "50%":      { borderColor: "#f87171" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
