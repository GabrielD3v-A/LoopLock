/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'lp-blue': '#03045E',
        'lp-lightblue': '#00B4D8',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'montserrat-italic': ['Montserrat-Italic', 'sans-serif']
      },
    },
  },
  plugins: [],
}