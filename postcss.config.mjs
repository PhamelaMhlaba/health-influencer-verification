// import tailwindcss from "tailwindcss";
// import autoprefixer from "autoprefixer";
// import presetEnv from "postcss-preset-env"; 

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 3,
      features: { "custom-properties": false }
    }
  }
};