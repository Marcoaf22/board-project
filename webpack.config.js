const path = require("path");

/** @type {import('webpack').Configuration} */

module.exports = {
  mode: "production",
  entry: "./index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public/js"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          // options: {
          //   presets: ["@babel/preset-env"],    //VA A USAR LA CONFIGURACION DE AFUERA
          // },
        },
      },
    ],
  },
};
