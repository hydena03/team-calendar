/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: 'var(--border)',
      },
      backgroundColor: {
        background: 'var(--background)',
      },
      textColor: {
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}