// /** @type {import('postcss-load-config').Config} */
// const config = {
//   plugins: {
//     "postcss-nesting": {}, 
//     // "@tailwindcss/postcss": {}, 
//      "tailwindcss": {}, 
//     autoprefixer: {}, 
//   },
// };

// export default config;
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 3,
      features: {
        'custom-properties': false
      }
    }
  }
}