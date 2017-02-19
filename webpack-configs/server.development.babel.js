import path from 'path'
import webpack from 'webpack'
import config from './utils/config'
import node from './utils/node'

export default {
  ...node,

  performance: config.performance,

  stats: config.stats,

  resolve: config.resolve,

  entry: {
    server: './server/development.js',
  },

  output: {
    filename: config.output.filename,
    path: config.output.path,
    publicPath: config.output.publicPath,
  },

  module: {
    rules: [
      ...config.module.rules,
    ]
  },

  plugins: [
    config.plugins.globals,
  ]
}
