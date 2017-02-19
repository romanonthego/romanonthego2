import get from 'lodash/get'

export default function getStatics() {
  // requiring at runtime is cumbersome :(
  let stats = fileSystem.readFileSync('build/stats.json')

  // do not wrap in try-catch. it should fail if something went wrong.
  stats = JSON.parse(stats)

  return {
    app: get(stats, 'assetsByChunkName.app[0]', 'app.js'),
    common: get(stats, 'assetsByChunkName.common[0]', 'common.css'),
    css: get(stats, 'assetsByChunkName.app[1]', 'app.css'),
    demoJs: get(stats, 'assetsByChunkName.demo[0]', 'demo.js'),
  }
}