/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rush-blue': '#1E40AF',
        'rush-black': '#1F2937',
      },
    },
  },
  plugins: [],
};
