/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0e179d",
        accent: "#6e56cf",
        "btn-blue": "#1e40af",
        border: "#e5e5e5",
        muted: "#737373",
        "footer-bg": "rgba(191,193,222,0.27)",
        card: "#fbfcfe",
      },
      fontFamily: {
        almarai: ["Almarai_400Regular"],
        "almarai-bold": ["Almarai_700Bold"],
      },
    },
  },
  plugins: [],
};
