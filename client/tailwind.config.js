/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'lp-blue': '#03045E',
        'lp-blue-2': '#023E8A',
        'lp-lightblue': '#00B4D8',
        'lp-lilas': '#CBCCF5',
        'lp-lilas-3': '#E8E9FA',
      },
      fontFamily: {
        'montserrat-bold': ['Montserrat-Bold', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'montserrat-light': ['Montserrat-Light', 'sans-serif'],
        'montserrat-italic': ['Montserrat-Italic', 'sans-serif'],
        'fellix-light': ['Fellix-Light', 'sans-serif'],
        'fellix-medium': ['Fellix-Medium', 'sans-serif'],
        'fellix-bold': ['Fellix-Bold', 'sans-serif'],
        'fellix-regular': ['Fellix-Regular', 'sans-serif'],
      },
    },
  },
  plugins: [],
}