/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stock: {
          normal: '#16a34a',
          low: '#d97706',
          negative: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
