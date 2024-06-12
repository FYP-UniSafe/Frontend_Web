const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/")
    }
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/uni-safe'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [],
  devServer: {
    contentBase: './dist/uni-safe',
    open: true
  }
};