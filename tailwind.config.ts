import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bgWhite: "#EEEEEE",
        navbar: "#BCBBBB",
        primary: "#131A15",
        secondary: "#032124",
        tertiary: "#EEEEEE",
        primaryGray: "#A0A0A0",
        secondaryGray: "#D3D3D3",
        colorRed: "#D32F2F",
        colorOrange: "#D32F2F",
        colorDirtyWhite: "#D32F2F",
        colorBlue: "#D32F2F",
        colorGreen: "#D32F2F",
      },
      dropShadow: {
        "container-shadow": "0 4px 6px rgba(155, 157, 161, 0.3)",
      },
    },
  },
  plugins: [],
} satisfies Config;
