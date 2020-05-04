const webpack = require('webpack');

const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const crypto = require('crypto');

module.exports = {
  mode: 'production',
  entry: {
      main: './src/index.js',
      dummy1: './src/dummypage.js',
      dummy2: './src/dummypage2.js'
    }, // define more entrypoints to trigger common and shared chunks
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en|es|fr)$/)
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          priority: 40,
          enforce: true
        },
        lib: {
          test(module) {
            return (
              module.size() > 150000 && // 150KB cut off for any npm library (change this value to meet your requirements)
              /node_modules[/\\]/.test(module.identifier())
            );
          },
          name(module) {
            const hash = crypto.createHash(`sha1`)
            hash.update(module.libIdent({ context: 'dir' }))

            return 'lib-' + hash.digest(`hex`).substring(0, 8)          
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true
        },
        commons: {
          name: 'commons',
          minChunks: 3, // define (or pass in) the total number of pages here
          priority: 20
        },
        shared: {
          name(module, chunks) {
            const hash = crypto
              .createHash(`sha1`)
              .update(chunks.reduce((acc, chunk) => acc + chunk.name, ``))
              .digest(`hex`)

            return hash
          },
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    }
  }
};
