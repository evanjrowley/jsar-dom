const path = require('node:path');
const webpack = require('webpack');
// const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'dev';

module.exports = {
  target: 'web',
  entry: './impl-babylonjs.ts',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'inline-source-map' : false,
  output: {
    filename: 'entry.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      vm: false,
      fs: false,
      url: require.resolve('url/'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      path: require.resolve('path-browserify'),
      assert: require.resolve('assert-browserify'),
      'process/browser': require.resolve('process/browser'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        },
      },
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new CompressionPlugin({
      test: /\.js$/,
      algorithm: 'gzip',
    }),
  ],
  // optimization: {
  //   minimizer: [new TerserPlugin()],
  // },
};
