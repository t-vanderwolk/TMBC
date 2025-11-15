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
        tmIvory: '#FBF4F3',
        tmMauve: '#B48A9B',
        tmMauveDark: '#A1788C',
        tmCharcoal: '#3E2F35',
        tmBlush: '#F2E6EA',
        tmDust: '#E7D9DF',
        tmWhite: '#FFFFFF',
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
