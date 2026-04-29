/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18221f",
        forest: "#164b3f",
        sage: "#dfe8dd",
        linen: "#f7f3ed",
        gold: "#b88a44",
        mist: "#eef1ee",
      },
      fontFamily: {
        sans: ["Quicksand", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 34, 31, 0.1)",
      },
    },
  },
  plugins: [],
};
