const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./src/renderer/main.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: '[name].[fullhash].js',
  },
  devServer: {
    // contentBase: path.resolve(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 8882,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.woff2?(\?.*)?$/,
        use: 'url-loader?limit=100000&mimetype=application/font-woff',
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
    },
    extensions: ['.js', '.vue', '.json'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      publicPath: './',
      minify: {
        collapseWhitespace: true,
      },
    }),
  ],
  // target: 'electron-renderer',
}