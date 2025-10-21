/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mauve: "#C8A1B4",
        blush: "#EAC9D1",
        ivory: "#FFFAF8",
        gold: "#D9C48E",
        charcoal: "#3E2F35",
      },
    },
  },
  plugins: [],
};
