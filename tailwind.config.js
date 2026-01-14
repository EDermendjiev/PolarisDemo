/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        header: {
          bg: '#5B7C99', // Approximation of the blue header
          text: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#5B7C99',
          dark: '#4A6B88',
        },
        status: {
          active: '#4CAF50',
          bg: '#E8F5E9',
        },
        danger: {
          DEFAULT: '#E53935',
        }
      }
    },
  },
  plugins: [],
}
