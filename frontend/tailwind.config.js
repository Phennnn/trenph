/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Tren-PH blue
        secondary: "#1e3a8a", // Darker blue
      },
    },
  },
  plugins: [],
};
