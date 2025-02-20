/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "postcss-nesting": {}, // Enables nesting in CSS, useful for maintainable styles
    "@tailwindcss/postcss": {}, // TailwindCSS for utility-first styling
    autoprefixer: {}, // Ensures cross-browser compatibility by adding vendor prefixes
  },
};

export default config;
