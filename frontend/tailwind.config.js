/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          obsidian: '#0A0912',   // Deep obsidian canvas base
          surface: '#151324',    // Dark lavender slate card surface
          lavender: '#B69DF8',   // Luminous soft lavender primary
          rose: '#E879F9',       // High-severity & accent alert
          mist: '#EDE9FE',       // Ultra-readable primary typography
          well: '#090810',       // Deep black textarea and diff well
          border: '#2E2A4A',     // Subtle lavender border
        },
        brand: {
          petrol: {
            deep: '#0A0912',
            surface: '#151324',
            border: '#2E2A4A',
          },
          terracotta: {
            DEFAULT: '#E879F9',
            hover: '#D946EF',
            light: 'rgba(232, 121, 249, 0.15)'
          },
          cyan: {
            DEFAULT: '#B69DF8',
            hover: '#A78BFA',
            glow: 'rgba(182, 157, 248, 0.35)'
          },
          ice: {
            DEFAULT: '#EDE9FE',
            muted: 'rgba(237, 233, 254, 0.75)',
            subtle: 'rgba(237, 233, 254, 0.10)'
          }
        }
      },
      boxShadow: {
        'brand-glow': '0 0 25px rgba(182, 157, 248, 0.35)',
        'alert-glow': '0 0 25px rgba(232, 121, 249, 0.35)',
      }
    },
  },
  plugins: [],
}
