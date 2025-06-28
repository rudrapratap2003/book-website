/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        adobe: ['"sassafras-std"', 'sans-serif'],
        gothic : ['"LXGW Marker Gothic"', 'sans-serif'],
        edu : ['"Edu QLD Hand", cursive'],
        parastoo: ['"Parastoo", serif']
      }
    },
  },
  plugins: [],
}

