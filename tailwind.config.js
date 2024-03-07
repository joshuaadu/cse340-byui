/** @type {import('tailwindcss').Config} */
export default {
  // content: [],
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      backgroundImage: {
        deloran: "url('/images/delorean.jpg')",
        "deloran-mb": "url('/images/delorean-tn.jpg')",
        "footer-texture": "url('/img/footer-texture.png')",
      },
    },
  },
  plugins: [],
};
