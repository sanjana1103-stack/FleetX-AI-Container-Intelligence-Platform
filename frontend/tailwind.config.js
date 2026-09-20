/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fleet: {
          orange: "#FF5C00",
          orangeHover: "#E04F00",
          orangeLight: "#FFF4ED",
          orangeGlow: "rgba(255, 92, 0, 0.15)",
          bg: "#F4F6F8",
          card: "#FFFFFF",
          cardBorder: "#EAEFF4",
          textMain: "#111827",
          textMuted: "#6B7280",
          textSub: "#9CA3AF",
          dark: "#0F172A",
          darkNavy: "#0B132B"
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'orange-glow': '0 0 25px rgba(255, 92, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
