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
    config.plugins.globals,
    config.plugins.commonChunk,
    config.plugins.extractCss,
    config.plugins.babili,
    config.plugins.stats,
    config.plugins.progressBar,
    ...(process.env.ANALYZE ? [config.plugins.bundleAnalyzer] : []),
  ],
}
