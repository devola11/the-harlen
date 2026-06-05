import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0C0C0C",
        charcoal: "#1A1A1A",
        graphite: "#2D2D2D",
        ivory: "#F5F0E8",
        cream: "#FAF7F2",
        linen: "#EDE8DF",
        ash: "#5F5C57",
        gold: {
          DEFAULT: "#C9A067",
          light: "#E8C98A",
          muted: "#8B6F47",
        },
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
