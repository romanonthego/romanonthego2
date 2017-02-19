import dotenv from 'dotenv'
import autoprefixer from 'autoprefixer'
import path from 'path'
import webpack from 'webpack'
import StatsPlugin from 'stats-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import composeGlobals from './composeGlobals'
import globals from './globals'

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
            options: {
              presets: ['react', 'es2015', 'stage-2'],
              plugins: [
                'add-module-exports',
                'transform-react-constant-elements',
                'transform-react-inline-elements',
                'syntax-dynamic-import',
              ]
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['mustache-loader']
      },
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
            loader: 'babel-loader',
            options: {
              presets: ['react', ['es2015', {modules: false}], 'stage-2'],
              plugins: [
                'add-module-exports',
                'transform-react-constant-elements',
                'transform-react-inline-elements',
                'syntax-dynamic-import',
                'react-hot-loader/babel',
              ],
            },
          },
        ],
        exclude: nodeModulesRegex,
      },
    ],
    rulesProduction: [
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
      minChunks: 2,
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
  },
}
