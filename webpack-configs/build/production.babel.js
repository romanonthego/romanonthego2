import server from '../server.production.babel'
import browser from '../browser.production.babel'

// start build (not watch - it useless) dev server
// dev server will handle prerender and browser build, no need to put it here
export default [browser]
