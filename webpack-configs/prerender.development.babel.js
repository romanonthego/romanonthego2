import path from 'path'
import webpack from 'webpack'
import config from './utils/config'
import node from './utils/node'

console.log(config.resolve)

export default {
  ...node,

  stats: config.stats,

  resolve: config.resolve,

  entry: {
    prerender: './app/prerender.production.js',
  },

  output: {
    filename: config.output.filename,
    path: config.output.path,
    publicPath: config.output.publicPath,
    library: 'prerender',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      ...config.module.rulesServer,
    ]
  },

  plugins: [
    config.plugins.globals,
  ]
}
