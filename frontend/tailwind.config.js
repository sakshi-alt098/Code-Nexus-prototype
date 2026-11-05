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
          midnight: '#0B1B3D',   // Base dark canvas / navigation
          slate: '#26425A',      // Card & panel surface
          cornflower: '#86A8CF', // Interactive primary, active tabs, buttons
          orchid: '#C38EB4',     // Critical alerts & unsupported claims
          blush: '#E1CBD7',      // Headings, icons, text tint
          well: '#07111C',       // Code wells, textareas
        },
        brand: {
          petrol: {
            deep: '#0B1B3D',   // Base dark canvas
            surface: '#26425A',// Card & panel surface
            border: '#355370', // Subtle borders
          },
          terracotta: {
            DEFAULT: '#C38EB4',// Critical alerts & unsupported claims (Dusty Orchid)
            hover: '#AB729C',
            light: 'rgba(195, 142, 180, 0.15)'
          },
          cyan: {
            DEFAULT: '#86A8CF',// Interactive primary (Cornflower Blue)
            hover: '#7297C0',
            glow: 'rgba(134, 168, 207, 0.3)'
          },
          ice: {
            DEFAULT: '#E1CBD7',// Headings, icons, text tint (Pale Blush)
            muted: 'rgba(225, 203, 215, 0.75)',
            subtle: 'rgba(225, 203, 215, 0.10)'
          }
        }
      },
      boxShadow: {
        'brand-glow': '0 0 20px rgba(134, 168, 207, 0.35)',
        'alert-glow': '0 0 20px rgba(195, 142, 180, 0.35)',
      }
    },
  },
  plugins: [],
}
