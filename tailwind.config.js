/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lloyds: "#007A33",   // Lloyds Green
        brandBlack: "#000000",
        brandWhite: "#FFFFFF",
        brandGray: "#6B7280", // Neutral gray accent
      },
    },
  },
  plugins: [],
};
