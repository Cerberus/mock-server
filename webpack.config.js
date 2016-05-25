'use strict';

module.exports = {
  entry: './public/app/index.js',
  output: {
    path: './public/js',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './public',
    port: 5555
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: ['', '.js', '.json', '.jsx']
  }
}
