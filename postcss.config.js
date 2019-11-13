module.exports = {
  plugins: [
      require('autoprefixer')({
          "overrideBrowserslist": [
              "defaults",
              "ie > 9",
              "last 2 versions",
              "> 1%", 
              "iOS 7",
              "last 3 iOS versions"
          ]
      })
  ]
};