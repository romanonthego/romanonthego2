import fileSystem from 'fs'
import MemoryFS from 'memory-fs'
import requireFromString from 'requireFromString'
// import ProgressPlugin from 'webpack/lib/ProgressPlugin'

// wow this tricky one
// this is basicly manualy constructed webpackDevMiddleware
// that we do is we watch for prerender in separate webpack compiler
// and on compile we construct new node module from string
// and pass it to callback :)
// this way we can have hot reload in server prerender (which is cool)
// and do not break our client hot server with node restarting
export default function watchPrerenderCompiler(webpackConfig, callbacks = {}) {
  const prerenderCompiler = webpack(webpackConfig)

  const fs = new MemoryFS()

  prerenderCompiler.outputFileSystem = fs

  // listening to webpack progress
  if (callbacks.progress) {
    prerenderCompiler.apply(new ProgressPlugin(callbacks.progress))
  }

  prerenderCompiler.watch({}, (err, stats) => {
    if (err) {
      console.log(err.stack)

      callbacks.done(err)
      return
    }
    try {
      const assetsByChunkName = stats.toJson({}).assetsByChunkName
      const prerenderFileName = assetsByChunkName.prerender[0]
      const prerenderFile = path.join(__dirname, 'build', prerenderFileName)

      const content = fs.readFileSync(prerenderFile, 'utf-8')
      const prerender = requireFromString(content)

      console.log('Prerender compiled sucessfully!')

      callbacks.done(null, prerender)
    } catch (e) {
      console.log('Prerender compile error!', e.stack)

      callbacks.done(e, null)
    }
  })
}