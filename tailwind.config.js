/** @type {import('tailwindcss').Config} */
const config = require("./src/constants/config")

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        '1': '1px'
      },
      colors: {
        'amber-550': '#e78b09',
        'header-theme': config.colorTheme.header,
      },
    },
  },
  plugins: [],
}

