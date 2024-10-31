/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // HTML 파일 내의 클래스 스캔
    "./src/**/*.{js,ts,jsx,tsx}", // src 폴더 내 모든 JS/TS 파일 스캔
  ],
  theme: {
    extend: {
      colors: { // 커스텀 색상 정의
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: { // 커스텀 둥글기 정의
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [], // 추가 플러그인이 필요한 경우 여기에 추가
}