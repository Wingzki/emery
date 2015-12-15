var webpack = require("webpack")
var path = require("path")
var LiveReloadPlugin = require('webpack-livereload-plugin')

module.exports = {
  devtool: 'source-map', // For production
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?sourceMap' },
      { test: /\.json$/,loader: 'json' },
      // { test: /\.scss$/, loader: 'style!css?sourceMap!resolve-url?sourceMap!sass?sourceMap' },
      { test: /\.scss$/, loader: 'style!raw!resolve-url!sass?sourceMap' },
      // { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'url?limit=10000' },
      { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'file' },
    ]
  },
  sassLoader: {
    includePaths: []
  },
  plugins: [
    // // For production
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     'NODE_ENV': JSON.stringify('production')
    //   }
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     warnings: false
    //   }
    // })
    new LiveReloadPlugin({
      appendScriptTag: true
    })
  ]
}
