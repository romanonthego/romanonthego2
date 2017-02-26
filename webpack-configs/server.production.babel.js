import path from 'path'
import webpack from 'webpack'
import config from './utils/config'
import node from './utils/node'

export default {
  ...node,

  stats: config.stats,

  resolve: config.resolve,

  entry: {
    server: './server/production.js',
  },

  output: {
    filename: config.output.filename,
    path: config.output.path,
    publicPath: config.output.publicPath,
    library: 'server',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      ...config.module.rulesServer,
    ]
  },

  plugins: [
    config.plugins.globals,
    config.plugins.progressBar,
  ]
}
