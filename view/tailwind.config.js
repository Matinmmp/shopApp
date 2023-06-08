/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./assets/views/*.{html,js}"],
  theme: {
    extend: {},
  },

  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#000000",

          secondary: "#212529",

          accent: "#F3F3F3",

          neutral: "#343A40",

          "base-100": "#fff",

          info: "#7d94de",

          success: "#145245",

          warning: "#f8cb4f",

          error: "#ec415d",
        },
      },
    ],
  },
};
