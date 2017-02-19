import express from 'express'
// import expressWebSocket from 'express-ws'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import prerender from 'app/prerender.development'
import {PORT, publicMiddeware} from './utils/shared'
import {webpackDevMiddleware, webpackHotMiddleware} from './utils/webpackMiddlewares'
import startMessage from './utils/startMessage'

const statics = {
  app: 'app.js',
  common: 'common.js',
  demoJs: 'demo.js',
}

const app = express()

// better logger for development
app.use(morgan('dev'))

app.use(cookieParser())

app.use('/', publicMiddeware)

app.use(webpackDevMiddleware)
app.use(webpackHotMiddleware)

app.use('/', (req, res) => {
  prerender(req, res, statics)
})

app.listen(PORT, startMessage('development', PORT))