/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#059669',
        'brand-dark': '#047857',
        'brand-light': '#10b981',
      },
    },
  },
  plugins: [],
}
