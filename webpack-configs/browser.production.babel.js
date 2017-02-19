import path from 'path'
import webpack from 'webpack'
import config from './utils/config'

export default {
  performance: config.performance,

  stats: config.stats,

  resolve: config.resolve,

  entry: {
    app: [
      './app/browser.js',
    ],
  },

  devtool: 'source-maps',

  output: {
    filename: config.output.filenameWithHash,
    path: config.output.path,
    publicPath: config.output.publicPath,
  },

  module: {
    rules: [
      ...config.module.rulesProduction,
    ]
  },

  plugins: [
    config.plugins.commonChunk,
    config.plugins.extractCss,
    config.plugins.uglify,
    config.plugins.globals,
    config.plugins.stats,
  ],
}
