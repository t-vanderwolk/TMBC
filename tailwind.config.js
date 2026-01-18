/** @type {import('tailwindcss').Config} */
const memberColors = require('./styles/memberColorTokens.json');

module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF8F6',
        blush: '#F3E6EA',
        mauve: '#C8A2B9',
        gold: '#C9A24D',
        charcoal: '#2E2E2E',
        'muted-foreground': '#6F666A',
        tmIvory: '#FAF7F4',
        tmBlush: '#F6E9E6',
        tmMauve: '#C7A7B7',
        tmDeepMauve: '#A57891',
        tmCharcoal: '#3E2F35',
        tmGold: '#D4B579',
        tmbc: {
          mauve: '#BFA6C9',
          blush: '#F5E3E6',
          ivory: '#FAF7F2',
          gold: '#C9A86A',
          charcoal: '#3B3738',
        },
        member: memberColors,
      },
      fontFamily: {
        script: ['var(--font-great-vibes)', 'cursive'],
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-nunito)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 14px rgba(0,0,0,0.07)',
        editorial: '0 35px 70px rgba(134, 75, 95, 0.25)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};
