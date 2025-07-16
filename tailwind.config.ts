// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 기존 color 설정은 그대로 둡니다.
        background: "var(--background)",
        foreground: "var(--foreground)",
        maincolor: "var(--maincolor)",
        subcolor: "var(--subcolor)",
        subBgcolor: "var(--subBgcolor)",
        mainBgcolor : "var(--mainBgcolor)",
        mainTextcolor : "var(--mainTextcolor)",
        subTextcolor : "var(--subTextcolor)",
        hovercolor : "var(--hovercolor)",
      },
      animation: {
        // 💡 [수정] 각 애니메이션이 자신의 키프레임을 사용하고, 끝난 상태를 유지(forwards)하도록 수정
        TransRight: "TransRight 1.5s ease-in-out forwards",
        Transleft: "Transleft 1.5s ease-in-out forwards",
      },
      keyframes: {
        TransRight: {
          "0%": { transform: "translateX(0rem)" },
          "100%": { transform: "translateX(23rem)" },
        },
        Transleft: {
          "0%": { transform: "translateX(23rem)" },
          "100%": { transform: "translateX(0rem)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;