/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#012A4A",
          800: "#013A63",
          700: "#01497C",
          600: "#014F86",
          500: "#2A6F97",
        },
        secondary: {
          500: "#2C7DA0",
          400: "#468FAF",
          300: "#61A5C2",
          200: "#89C2D9",
          100: "#A9D6E5",
        },
      },
    },
  },
  plugins: [],
};