/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          light: "var(--primary-light)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
        },
        surface: "var(--surface)",
        body: "var(--text)",
        muted: "var(--muted-text)",
        border: "var(--border)",
        status: {
          submitted: "var(--status-submitted)",
          review: "var(--status-review)",
          assigned: "var(--status-assigned)",
          progress: "var(--status-progress)",
          resolved: "var(--status-resolved)",
          closed: "var(--status-closed)",
        },
        priority: {
          low: "var(--priority-low)",
          medium: "var(--priority-medium)",
          high: "var(--priority-high)",
          critical: "var(--priority-critical)",
        },
        category: {
          road: "var(--category-road)",
          streetlight: "var(--category-streetlight)",
          drainage: "var(--category-drainage)",
          footpath: "var(--category-footpath)",
          waste: "var(--category-waste)",
          public: "var(--category-public)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
