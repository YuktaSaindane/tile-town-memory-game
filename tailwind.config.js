/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'game': ['Fredoka', 'Comic Neue', 'cursive'],
      },
      colors: {
        'tile-town': {
          50: '#fef7ff',
          100: '#fceeff',
          200: '#f8ddff',
          300: '#f0c1ff',
          400: '#e596ff',
          500: '#d669ff',
          600: '#c147f7',
          700: '#a632e3',
          800: '#872abc',
          900: '#6f2497',
        }
      }
    },
  },
  plugins: [],
} 