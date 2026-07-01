/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Focus brand palette — calm, deep, distraction-free
        ink: {
          50: '#f5f6fa',
          100: '#e9ebf3',
          200: '#cbd0e2',
          300: '#a3abcb',
          400: '#727fac',
          500: '#515d8f',
          600: '#3f4874',
          700: '#343b5e',
          800: '#20243a',
          850: '#191d30',
          900: '#141726',
          950: '#0c0e18',
        },
        focus: {
          400: '#6ee7d3',
          500: '#2dd4bf',
          600: '#14b8a6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
