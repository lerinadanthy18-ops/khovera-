/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Playfair Display', 'Georgia', 'serif'] },
      colors: {
        ink: '#0F172A', paper: '#FAF8F5', sand: '#EDE6D8', gold: '#B99A62', moss: '#6F9A88', fog: '#6B7280',
        brand: { 50: '#f4efe6', 100: '#ede6d8', 200: '#ddd0bb', 300: '#cdbb9d', 400: '#b99a62', 500: '#9d814e', 600: '#0f172a', 700: '#0b1220', 800: '#08101b', 900: '#050b13' },
        accent: { 50: '#eaf2ee', 100: '#dbeae1', 200: '#c0d8ca', 300: '#9fc0ad', 400: '#6f9a88', 500: '#527c6b', 600: '#3f6355', 700: '#304c42', 800: '#233a32', 900: '#182a24' },
      }
    },
  },
  plugins: [],
};
