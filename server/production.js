import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import prerender from 'app/prerender.production'
import {PORT, publicMiddeware, assetsMiddleware} from './utils/shared'
import startMessage from './utils/startMessage'
import getStatics from './utils/getStatics'

const statics = getStatics()
const app = express()

// security middleware
// https://github.com/helmetjs/helmet - read more
app.use(helmet())
app.use(morgan('dev'))

app.use(cookieParser())

// gzip all the things
app.use(compression())

app.use('/', publicMiddeware)
app.use('/assets', assetsMiddleware)

app.use('/', (req, res) => {
  prerender(req, res, statics)
})

app.listen(PORT, startMessage('production', PORT))