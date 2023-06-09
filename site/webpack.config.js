const path = require('path');
const webpack = require('webpack');

const DIST_PATH = path.join(__dirname, 'dist/js');

// TODO: watch local packages

module.exports = {
  cache: false,
  entry: {
    home: './src/entry/home.js',
    battle: './src/entry/battle.js',
  },
  output: {
    filename: '[name].js', // TODO: [contenthash]
    path: DIST_PATH,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      asset: path.resolve(__dirname, 'asset'),
    },
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      PATH_PREFIX: JSON.stringify('/easyxq/'),
    }),
  ],
  devtool: 'eval',
};
