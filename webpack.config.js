/* eslint global-require: 0 */

const path = require('path');
const webpack = require('webpack');

const ESlintFormatter = require('eslint-friendly-formatter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = !process.argv.includes('-p');

const commonPlugins = [
  // Extract styles to its own file we can manually include in the html (instead of being dynamically added to the page)
  new MiniCssExtractPlugin({ filename: isDev ? 'bundle.css' : 'bundle-[hash].css' }),

  // Use the provide plugin for any libraries that need to be globally available (like jquery used to be)
  // new webpack.ProvidePlugin({
  // }),

  new CopyWebpackPlugin([
    { from: 'CNAME' }
  ]),

  new VueLoaderPlugin(),

  new HtmlWebpackPlugin({
    hash: true,
    template: './index.html',
    filename: isDev ? 'index.html' : './200.html', // relative to root of the application
    minify: false,
    inject: true,
    favicon: './src/favicon.ico'
  })
];

const productionPlugins = [
  new webpack.optimize.MinChunkSizePlugin({
    minChunkSize: 51200 // ~50kb
  })
];

const extraPlugins = isDev ? [] : productionPlugins;
const plugins = [...commonPlugins, ...extraPlugins];

// The webpack configuration
module.exports = {
  mode: isDev ? 'development' : 'production',

  devtool: isDev ? 'cheap-module-eval-source-map' : false, // for rendering sourcemaps, see https://webpack.js.org/configuration/devtool/

  // The files that sit at the root of the dependency tree and webpack starts processing to get all files to get included
  entry: {
    // this will end as the bundle.js file
    bundle: ['./src/index.js']
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        chunkFilter: chunk => !isDev && chunk.name !== 'vendor',
        sourceMap: isDev
      })
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve('./src/')],
        options: {
          formatter: ESlintFormatter
        }
      },
      {
        test: /\.js$/,
        // Include any other node_modules that require transpiling here
        include: [path.resolve('./src/')],
        use: 'babel-loader' // Put all babel configuration in .babelrc
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader', // Will detect from .babelrc and process all <script> blocks with babel
        options: {
          loaders: {
            // vue-loader will try to use a "scss-loader" when finding <style lang="scss"></style> blocks
            // in order to use sass-loader with scss in vue files, we need to tell it exactly what to do
            scss: ['vue-style-loader', 'css-loader', 'sass-loader']
          }
        }
      },
      {
        test: /\.md$/,
        use: 'markdown-image-loader'
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            query: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [require('precss'), require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      },
      {
        // inline fonts smaller than 10kb
        // for bigger files the file-loader is used by default, which copies file to the build folder and uses url to load it
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              outputPath: 'fonts/',
              name: '[name]-[hash].[ext]'
            }
          }
        ]
      },
      {
        // inline images less than 10kb
        // for bigger files the file-loader is used by default, which copies file to the build folder and uses url to load it
        test: /\.(png|gif|jpg|jpeg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              outputPath: 'img/',
              name: '[name]-[hash].[ext]'
            }
          }
        ]
      }
    ]
  },

  plugins,

  devServer: {
    overlay: true, // Display build errors in the browser
    lazy: false, // Set to true if you do not want the page to reload on file changes
    port: 9001,
    historyApiFallback: true
  },

  output: {
    path: path.resolve('wwwroot'),
    publicPath: '/',
    filename: isDev ? '[name].js' : '[name]-[hash].js'
  }
};
