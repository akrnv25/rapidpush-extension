const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const JsonMinimizerPlugin = require('json-minimizer-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.js',
    content: './src/content.js',
    background: './src/background.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', 'minify']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './assets', to: './assets' },
        { from: './src/manifest.json', to: './manifest.json' },
        { from: './src/popup.html', to: './popup.html' },
        { from: './src/popup.css', to: './popup.css' }
      ]
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new HtmlMinimizerPlugin(), new CssMinimizerPlugin(), new JsonMinimizerPlugin()]
  }
};
