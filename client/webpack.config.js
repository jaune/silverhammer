var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'Home': './lib/page-loader.js!' + __dirname + '/page/Home.jsx'
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/web',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-1', 'react'],
          // plugins: ['transform-decorators-legacy']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap', 'sass?sourceMap')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};