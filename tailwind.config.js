module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1E3A5F",
        teal: "#0D9488",
        gold: "#F59E0B",
        green: "#10B981",
        yellow: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        sm: "0 2px 4px rgba(0,0,0,0.05)",
        DEFAULT: "0 2px 8px rgba(0,0,0,0.08)",
        md: "0 4px 12px rgba(0,0,0,0.1)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
}
