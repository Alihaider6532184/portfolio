import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0B100E", // page — near-black with a green-teal undertone
          800: "#0F1613", // raised surface
          700: "#16201C", // cards
          600: "#1C2823", // hover surface
        },
        line: "#22302B", // hairline borders
        bone: {
          DEFAULT: "#ECE7DB", // primary text, warm off-white
          dim: "#9AA39C", // muted sage-gray
          faint: "#5E6B64", // captions / disabled
        },
        amber: {
          DEFAULT: "#E8823C", // molten copper accent
          bright: "#F5A65B", // hover / glow
          deep: "#B85F27",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        shell: "1240px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;
