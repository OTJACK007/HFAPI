/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: '#ff3366',
        secondary: '#2eff94',
        accent: '#147dff',
        background: '#1A1A1A',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'glow': 'glow 4s ease-in-out infinite alternate',
        'scaleIn': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { 'box-shadow': '0 0 40px #ff3366' },
          '100%': { 'box-shadow': '0 0 80px #2eff94' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' }
        },
      }
    },
  },
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [nextui()],
}