/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'mid-md': '896px',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        '18': '4.5rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '5/4': '125%',
      },
      borderWidth: {
        '6': '6px',
      }
    },
  },
  plugins: [require('@tailwindcss/typography', '@tailwindcss/forms')],
};
