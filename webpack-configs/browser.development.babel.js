import path from 'path'
import webpack from 'webpack'
import config from './utils/config'

export default {
  performance: {
    hints: false,
  },

  stats: config.stats,

  resolve: config.resolve,

  entry: {
    app: [
      'webpack-hot-middleware/client?overlay=true&reload=false',
      './app/browser.js',
    ],
  },

  devtool: 'eval',

  output: {
    filename: config.output.filename,
    path: config.output.path,
    publicPath: config.output.publicPath,
  },

  module: {
    rules: [
      ...config.module.rulesHot,
    ]
  },

  plugins: [
    config.plugins.commonChunk,
    config.plugins.globals,
    config.plugins.hmr,
    config.plugins.namedModules,
  ],
}
