const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    main: ['./src/main/main.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: '[name].js',
    publicPath: './'
  },
  module: {
    rules: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/main'),
    },
    extensions: ['*', '.js'],
  },
  externals: [
    { 'electron-updater': 'require("electron-updater")' },
  ],
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/preload', to: 'preload' },
        { from: './src/message.js', to: 'preload' }
      ],
    }),
  ],
  target: 'electron-main',
}