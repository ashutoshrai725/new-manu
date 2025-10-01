/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'manu-green': '#01C023',
        'manu-dark': '#000000ff',
        'manu-light': '#ffffffff',
        'manu-custom': '#a4a4a4ff',

      }
    },
  },
  plugins: [],
}


