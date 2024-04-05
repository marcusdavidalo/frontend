/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      animation: {
        scroll: "scroll 2s linear infinite",
        fadeIn: "fadeIn 2s ease-in forwards",
        fadeOut: "fadeOut 2s ease-in forwards",
        float: "float 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        float: {
          "0%": { transform: "translateY(5px)" },
          "50%": { transform: "translateY(-5px)" },
          "100%": { transform: "translateY(5px)" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
