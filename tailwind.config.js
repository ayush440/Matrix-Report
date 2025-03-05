/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    
    extend: {
      
      boxShadow: {
        '3xl': '0px 0px 3px 5px rgba(255, 255, 255)',
      }
    },
  },
  plugins: [],
}

