import expressWebSocket from 'express-ws'
import prerenderDevelopment from 'app/prerender.development'
import watchPrerenderCompiler from './watchPrerenderCompiler'
import prerenderWebpackConfig from 'webpack-configs/prerender.development.babel'

export default function getPrerender(app, usePrerender = false, onUpdate) {
  if (!usePrerender) {
    onUpdate(null, prerenderDevelopment)
  }

  const appWs = expressWebSocket(app)

  app.ws('/prerender-status', (ws) => {
    ws.on('message', (msg = 'hello') => ws.send(msg))
  })

  watchPrerenderCompiler({
    config: prerenderWebpackConfig,
    onProgress: (percentage, msg) => {
      appWs.getWss().clients.map((client) => client.send(JSON.stringify({percentage, msg})))
    },
    onDone: (err, compiledPrerender) => {
      if (err) {
        onUpdate(err, null)
      } else {
        onUpdate(null, compiledPrerender)
      }
    },
  })
}