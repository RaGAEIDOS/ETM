import type { Config } from "tailwindcss";

/**
 * Every colour utility used by the app resolves to a CSS custom property from
 * `app/globals.css`. That is what lets the four themes restyle all 2,400+
 * static pages without editing any content file.
 */
const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const scale = (family: string, shades: readonly number[]) =>
  Object.fromEntries(shades.map((shade) => [shade, token(`--tw-${family}-${shade}`)]));

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        white: token("--tw-white"),
        black: token("--tw-black"),
        slate: scale("slate", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        ink: scale("ink", [950, 900, 800, 700]),
        cyan: scale("cyan", [100, 200, 300, 400, 500, 600]),
        violet: scale("violet", [100, 200, 300, 400, 500, 600]),
        sky: scale("sky", [400, 500]),
        blue: scale("blue", [400, 500]),
        indigo: scale("indigo", [500]),
        purple: scale("purple", [500, 600]),
        teal: scale("teal", [400, 500]),
        pink: scale("pink", [400, 500]),
        emerald: scale("emerald", [100, 200, 300, 400, 500, 950]),
        amber: scale("amber", [50, 100, 200, 300, 400, 500, 600]),
        yellow: scale("yellow", [300, 500]),
        orange: scale("orange", [300, 400, 500]),
        rose: scale("rose", [200, 300, 400, 500]),
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "gradient-x": "gradientX 8s ease infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        gradientX: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
