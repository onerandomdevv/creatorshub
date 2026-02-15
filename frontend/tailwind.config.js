/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",   // black
        secondary: "#ffffff", // white
        accent: "#ef476f",    // pinkish red
        teal: "#06b6d4",      // teal
      },
    },
  },
  plugins: [],
};
