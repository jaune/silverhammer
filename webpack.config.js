const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const walk = require('fs-walk'),
      fs = require('fs'),
      path = require('path');


var entries = {};
var entriesPath = path.join(__dirname, 'pages');

walk.walkSync(entriesPath, function(basedir, filename, stat) {
  var absPath = path.join(basedir, filename);

  if (stat.isFile() && (path.extname(filename) === '.jsx')) {
    var parts = path.relative(entriesPath, absPath).slice(0, -4).split(path.sep);

    entries[parts.join('/')] = './lib/page-loader.js!' + absPath;
  }
});


module.exports = {
  entry: entries,
  devtool: 'source-map',
  output: {
    path: __dirname + '/web',
    filename: '[name].chunk.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/
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
    new ExtractTextPlugin('[name].chunk.css'),
    new CommonsChunkPlugin('commons.chunk.js'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};