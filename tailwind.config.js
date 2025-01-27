/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"], // add this line
  theme: {
    extend: {
      colors: {
        primary: "#00a551", // Football field green
        secondary: "#ffff33", // Gold for highlights
        accent: "#ffffff", // White for contrast
        background: "#f9f9f9", // Light gray for content areas
        text: "#333333", // Dark gray for text
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        display: ["Oswald", "sans-serif"], // For headings
        body: ["Roboto", "sans-serif"], // For body text
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1)",
        button: "0 2px 4px rgba(0, 0, 0, 0.2)",
      },
    },
    plugins: [
      require("flowbite/plugin"), // add this line
    ],
  },
  plugins: [
    require("flowbite/plugin"), // add this line
  ],
};
