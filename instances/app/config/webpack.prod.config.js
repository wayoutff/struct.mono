import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import { getStyleLoaders } from './webpack.helpers.js'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { fileURLToPath } from 'url';
import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import BrotliPlugin from 'brotli-webpack-plugin'
import getClientEnvironment from './env.cjs'

const env = getClientEnvironment()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolve = (dir) => path.resolve(__dirname, '../', dir)

/**
 * BABEL PRESETS & PLUGINS
 */
const babelPresets = [
  '@babel/preset-env',
  '@babel/preset-typescript',
  [
    '@babel/preset-react', {
      runtime: 'automatic'
    }
  ]
]
const babelPlugins = [
  '@babel/plugin-proposal-class-properties',
  ["@babel/transform-runtime", {
    "regenerator": true
  }],
  'babel-plugin-transform-react-jsx'
]
/**================================ */

const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'
  }),
  new ReactRefreshWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: 'public/index.html'
  })
]

// const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true
export default {
  mode: 'production',
  devtool: false,
  context: path.resolve(__dirname, '../'),
  entry: resolve('src/index.tsx'),
  output: {
    path: resolve('dist'),
    filename: '[name].bundle.[contenthash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      components: resolve('src/components/'),
      src: resolve('src'),
      '~': path.resolve(__dirname, '../main'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: babelPresets,
            plugins: [
              // require.resolve('react-refresh/babel')
            ].concat(babelPlugins).filter(Boolean)
          }
        }
      },
      {
        test: /\.css$/,
        use: getStyleLoaders()
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders(['postcss-loader', 'stylus-loader'])
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
    ]
  },
  plugins,
  // performance: {hints: false},
  optimization: {
    minimize: true,
    minimizer: [
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new JsonMinimizerPlugin(),
      new CssMinimizerPlugin({
        minimizerOptions: {
          // no ie please!
          // targets: { ie: 11 },
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      }),
      new webpack.DefinePlugin(env.stringified),
      new TerserPlugin({
        // TerserPlugin config is taken entirely from react-scripts
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            // TODO: according to TypeScript, compress does not have an 'ecma' option. Investigate
            // ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: false
      })
    ],
    // namedModules: true,
    noEmitOnErrors: true,
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          maxSize: 200000,
          name: 'vendor',
          chunks: 'all'
        }
      }
      // cacheGroups: {
      //   defaultVendors: {
      //     test: /[\\/]node_modules[\\/]/,
      //     priority: -10,
      //     reuseExistingChunk: true,
      //   },
      //   default: {
      //     minChunks: 2,
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
    },
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendor',
    //       chunks: 'all'
    //     }
    //   }
    // }
  },
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false
  }
}
