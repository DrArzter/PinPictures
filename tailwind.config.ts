// tailwind.config.js
module.exports = {
  darkMode: "class", // Укажите "class" для поддержки темного режима с помощью next-themes
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      fontSize: {
        "icon-sm": "1.5rem",
        "icon-md": "3rem",
        "icon-lg": "5rem",
        "icon-xl": "8rem",
        "icon-2xl": "12rem",
      },
      screens: {
        "3xl": "1600px",
        "4xl": "1920px",
        "5xl": "2240px",
        "6xl": "2560px",
        "7xl": "2880px",
        "8xl": "3200px",
        "9xl": "3520px",
        "10xl": "3840px",
        "11xl": "4160px",
        "12xl": "4480px",
        "13xl": "4800px",
        "14xl": "5120px",
        "15xl": "7680px",
      },
      zIndex: {
        '100': '100',
      },
      maxWidth: {
        xss: "20rem",
        xdd: "24rem",
        xii: "28rem",
        xuu: "32rem",
        xkk: "36rem",
        xlll: "40rem",
        "2xll": "48rem",
        "3xll": "56rem",
        "4xll": "64rem",
        "5xll": "72rem",
        "6xll": "80rem",
        "7xll": "88rem",
        full: "100%",
        min: "min-content",
        max: "max-content",
      },
      colors: {
        lightModeBackground: "#FFFF",
        lightModeText: "#333333",
        lightModeSecondaryBackground: "#E5E5E5",
        lightModeSecondaryText: "#555555",

        darkModeBackground: "#333333",
        darkModeText: "#F2F2F2",
        darkModeSecondaryBackground: "#555555",
        darkModeSecondaryText: "#767676",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")], 
};
