/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E90FF', // Electric Blue
          light: '#4DA6FF',
          dark: '#0066CC'
        },
        secondary: {
          DEFAULT: '#A4DE02', // Lime Green
          light: '#B8E62E',
          dark: '#8BC400'
        },
        accent: {
          DEFAULT: '#FF6F61', // Coral Orange
          light: '#FF8A7F',
          dark: '#E55A4D'
        },
        background: '#F8F9FA', // Off-White
        text: '#333333' // Charcoal Gray
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
} 