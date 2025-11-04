/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'jp': ['Noto Sans JP', 'sans-serif'],
        'en': ['Inter', 'sans-serif'],
      },
      minHeight: {
        'screen-ios': '100vh',
      },
    },
  },
  plugins: [],
}