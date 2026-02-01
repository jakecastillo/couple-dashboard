import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff7f8",
          100: "#ffe9ee",
          200: "#ffd1db",
          300: "#ffadbf",
          400: "#ff7da0",
          500: "#f84d7c",
          600: "#e73166",
          700: "#c01f50",
          800: "#9d1b44",
          900: "#831a3b"
        },
        sand: {
          50: "#fbfaf8",
          100: "#f7f2ec",
          200: "#efe5da",
          300: "#e3d1bd",
          400: "#cfb396",
          500: "#b8926f",
          600: "#9c7755",
          700: "#7f5f45",
          800: "#6a4f3b",
          900: "#5a4334"
        }
      },
      boxShadow: {
        soft: "0 12px 30px -18px rgba(15, 23, 42, 0.35)",
        card: "0 10px 30px -18px rgba(15, 23, 42, 0.28)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 10s ease-in-out infinite",
        fadeUp: "fadeUp 300ms ease-out both"
      }
    }
  },
  plugins: [typography]
};

export default config;
