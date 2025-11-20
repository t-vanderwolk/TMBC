/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        tmIvory: '#FAF7F4',
        tmBlush: '#F6E9E6',
        tmMauve: '#C7A7B7',
        tmDeepMauve: '#A57891',
        tmCharcoal: '#3E2F35',
        tmGold: '#D4B579',
      },
      fontFamily: {
        script: ['var(--font-great-vibes)', 'cursive'],
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 25px 65px rgba(200, 162, 200, 0.15)',
        editorial: '0 35px 70px rgba(134, 75, 95, 0.25)',
      },
    },
  },
  plugins: [],
};
