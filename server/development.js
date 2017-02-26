import express from 'express'
// import expressWebSocket from 'express-ws'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import prerenderDevelopment from 'app/prerender.development'
import {PORT, publicMiddeware} from './utils/shared'
import {webpackDevMiddleware, webpackHotMiddleware} from './utils/webpackMiddlewares'
import startMessage from './utils/startMessage'
import getPrerender from './utils/getPrerender'
import noPrerenderTemplate from './utils/templateNoPrerender.html'

const statics = {
  app: 'app.js',
  common: 'common.js',
  demoJs: 'demo.js',
}

const app = express()

let prerender = null

// getting prerender
getPrerender(app, GLOBALS.DEV_PRERENDER, (err, compiledPrerender) => {
  if (err) {
    prerender = null
  } else {
    prerender = compiledPrerender
  }
})

// better logger for development
app.use(morgan('dev'))

app.use(cookieParser())

app.use('/', publicMiddeware)

app.use(webpackDevMiddleware)
app.use(webpackHotMiddleware)


app.use('/', (req, res) => {
  if (prerender) {
    prerender(req, res, statics)
  } else {
    res.send(noPrerenderTemplate({timeout: 3}))
  }
})

app.listen(PORT, startMessage('development', PORT))