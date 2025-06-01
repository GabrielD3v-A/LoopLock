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
        'lp-lilas-2': '#DEDFFC',
        'lp-lilas-3': '#E8E9FA',
      },
    },
  },
  plugins: [],
}