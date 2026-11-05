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
        brand: {
          petrol: {
            deep: '#003135',   // Base dark canvas / navigation
            surface: '#024950',// Card & panel surface
            border: '#046872', // Subtle borders
          },
          terracotta: {
            DEFAULT: '#964734',// Critical alerts & unsupported claims
            hover: '#7E3827',
            light: 'rgba(150, 71, 52, 0.15)'
          },
          cyan: {
            DEFAULT: '#0FA4AF',// Interactive primary, active tabs, buttons
            hover: '#0C838C',
            glow: 'rgba(15, 164, 175, 0.25)'
          },
          ice: {
            DEFAULT: '#AFDDE5',// Headings, icons, text tint
            muted: 'rgba(175, 221, 229, 0.75)',
            subtle: 'rgba(175, 221, 229, 0.10)'
          }
        }
      },
      boxShadow: {
        'brand-glow': '0 0 20px rgba(15, 164, 175, 0.25)',
        'alert-glow': '0 0 20px rgba(150, 71, 52, 0.25)',
      }
    },
  },
  plugins: [],
}
