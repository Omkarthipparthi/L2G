// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    background: './src/background.ts', // Ensure this path is correct
    'content-script': './src/content-script.ts',
},
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/leet2-git/browser'),
  },
};
