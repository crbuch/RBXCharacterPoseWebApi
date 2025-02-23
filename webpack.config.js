const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

module.exports = {
  entry: './src/index.ts', // Entry file
  output: {
    filename: 'bundle.js', // Output bundle file
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Use your existing HTML file
      inject: "body", // Ensures scripts are added correctly
    }),
    new HtmlInlineScriptPlugin(), // Inlines the bundle.js script
  ],
  mode: 'production', // Change to 'production' for production build
};
