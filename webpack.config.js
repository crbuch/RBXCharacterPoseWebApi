const path = require('path');

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
  mode: 'development', // Change to 'production' for production build
};
