module.exports = {
  purge: [
    "./public/**/*.html",
    "./src/**/*.js",
    "./src/**/*.jsx",
    "./src/**/*.tsx",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing:{
        '144': '36rem',
      },
      backgroundColor :{
        primary: '#00B0AB',
      },
      textColor: {
        primary: '#00B0AB',
      }
    },
  
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
