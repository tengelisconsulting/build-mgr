const path = require('path');

module.exports = {
  entry: './src/main.ts',
  target: "node",
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'target'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts?$/,
      }
    ]
  },
};
