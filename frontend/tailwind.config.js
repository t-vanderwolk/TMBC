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
        tmMauve: '#C8A2C8',
        tmBlush: '#F5DDE0',
        tmIvory: '#FAF7F2',
        tmCharcoal: '#3E2F35',
        tmGold: '#E7D7B9',
      },
      fontFamily: {
        script: ['var(--font-great-vibes)', 'cursive'],
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 25px 65px rgba(200, 162, 200, 0.15)',
      },
    },
  },
  plugins: [],
};
