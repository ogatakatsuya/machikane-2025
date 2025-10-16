import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "scale-102": "scale-102 0.2s ease-in-out",
        wave1: "wave1 8s linear infinite",
        wave2: "wave2 12s linear infinite reverse",
        wave3: "wave3 6s linear infinite",
        slideInFromRight: "slideInFromRight 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)", opacity: "0.7" },
          "50%": { transform: "translateY(-20px)", opacity: "1" },
        },
        "scale-102": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" },
        },
        wave1: {
          "0%": { transform: "translateX(-100%) skewX(-12deg)" },
          "100%": { transform: "translateX(100%) skewX(-12deg)" },
        },
        wave2: {
          "0%": { transform: "translateX(-100%) skewX(12deg)" },
          "100%": { transform: "translateX(100%) skewX(12deg)" },
        },
        wave3: {
          "0%": { transform: "translateX(-100%) skewX(-6deg)" },
          "100%": { transform: "translateX(100%) skewX(-6deg)" },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
