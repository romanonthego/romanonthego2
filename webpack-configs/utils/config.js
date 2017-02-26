import dotenv from 'dotenv'
import autoprefixer from 'autoprefixer'
import path from 'path'
import webpack from 'webpack'
import StatsPlugin from 'stats-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ClosureCompilerPlugin from 'webpack-closure-compiler'
import BabiliWebpackPlugin from 'babili-webpack-plugin'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import ProgressBarWebpackPlugin from 'progress-bar-webpack-plugin'
import composeGlobals from './composeGlobals'
import globals from './globals'
import babelOptions from './babelOptions'

const __DIR = path.resolve('./')

dotenv.config({
  path: path.join(__DIR, '.env'),
})

const nodeModulesRegex = /node_modules(?!.+-es6)/
const nodeEnvFromProcess = JSON.stringify(process.env.NODE_ENV || 'development')

const composedGlobals = {
  // node.js fixtures
  __dirname: JSON.stringify(__DIR),
  __filename: JSON.stringify(path.join(__DIR, 'index.js')),
  // react minification hach or something. prevent warning in production console
  NODE_ENV: nodeEnvFromProcess,
  'process.env.NODE_ENV': nodeEnvFromProcess,
  // globals
  GLOBALS: composeGlobals(globals)
}

// how we handle
const stylesLoaders = [
  {
    loader: 'css-loader',
    options: {
      disableStructuralMinification: true,
      modules: true,
      localIdentName: '[name]-[local]-[hash:base64:5]',
    },
  },
  {
    loader:'stylus-loader',
    options: {
      import: [path.join(__DIR, 'app', 'styles', 'vars.styl')],
      preferPathResolver: 'webpack',
    },
  }
]

export default {
  context: __DIR,

  stats: {
    children: false,
    chunks: false,
    // Add built modules information to chunk information
    chunkModules: false,
    // Add the origins of chunks and chunk merging info
    chunkOrigins: false,
    modules: false,
    colors: true,
    // Add errors
    errors: true,
    // Add details to errors (like resolving log)
    errorDetails: true,
  },

  performance: {
    hints: 'warning',
    maxAssetSize: 250000,
    maxEntrypointSize: 300000,
    assetFilter: (assetFilename) => {
      return assetFilename.endsWith('.js')
    }
  },

  resolve: {
    modules: [
      __DIR,
      "node_modules"
    ],

    extensions: ['.js', '.jsx'],

    alias: {
      app: path.join(__DIR, 'app'),
      build: path.join(__DIR, 'build'),
      server: path.join(__DIR, 'server'),
      'webpack-configs': path.join(__DIR, 'webpack-configs'),
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },

  output: {
    filename: '[name].js',
    // long term caching. only for production
    filenameWithHash: '[name]@[chunkhash:12].js',
    path: path.join(__DIR, 'build'),
    publicPath: '/assets/',
  },

  module: {
    rulesServer: [
      {
        test: /\.js|jsx$/,
        exclude: nodeModulesRegex,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions({useModules: true, node: true}),
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['mustache-loader']
      },
      {
        test: /\.styl$/,
        use: [{loader: 'null-loader'}, ...stylesLoaders],
      }
    ],
    rulesHot: [
      {
        test: /.styl$/,
        use: [{loader: 'style-loader'}, ...stylesLoaders],
      },
      {
        test: /\.js|jsx$/,
        use: [
          {
            loader: 'react-hot-loader'
          },
          {
            loader: 'babel-loader',
            options: babelOptions(),
          },
        ],
        exclude: nodeModulesRegex,
      },
    ],
    rulesProduction: [
      {
        test: /\.js|jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions({addReactOptimization: true}),
          },
        ],
        exclude: nodeModulesRegex,
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...stylesLoaders,]
        })
      }
    ]
  },

  plugins: {
    commonChunk: new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: function (module) {
         // this assumes your vendor imports exist in the node_modules directory
         return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    extractCss: new ExtractTextPlugin({
      filename:'[name]@[contenthash:12].css',
      allChunks: true,
      ignoreOrder: true,
    }),
    uglify: new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compressor: {
        warnings: false,
      },
    }),
    globals: new webpack.DefinePlugin(composedGlobals),
    hmr: new webpack.HotModuleReplacementPlugin(),
    namedModules: new webpack.NamedModulesPlugin(),
    stats: new StatsPlugin('stats.json', {
      chunkModules: true,
      exclude: [nodeModulesRegex],
      hash: false,
      version: false,
      timings: false,
      assets: true,
      chunks: false,
      chunkModules: false,
      modules: false,
      children: false,
      cached: false,
      reasons: false,
      source: false,
      errorDetails: false,
      chunkOrigins: false,
    }),
    babili: new BabiliWebpackPlugin({
      evaluate: true,
      deadcode: true,
      infinity: true,
      mangle: true,
      numericLiterals: true,
      replace: true,
      simplify: true,
      mergeVars: true,
      booleans: true,
      regexpConstructors: true,
      removeConsole: true,
      removeDebugger: true,
      removeUndefined: true,
      undefinedToVoid: true,
    }),
    bundleAnalyzer: new BundleAnalyzerPlugin(),
    progressBar: new ProgressBarWebpackPlugin(),
  },
}
