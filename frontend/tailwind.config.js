/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a", // Deep blue
        secondary: "#047857", // Green
        danger: "#dc2626", // Red
        warning: "#d97706", // Amber
      }
    },
  },
  plugins: [],
}
