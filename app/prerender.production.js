import 'isomorphic-fetch'
import React from 'react'
import {renderToString} from 'react-dom/server'
// import renderToString from 'preact-render-to-string'
import {match, createMemoryHistory} from 'react-router/es'
import {ReduxAsyncConnect, loadOnServer} from 'redux-connect'
import {Provider} from 'react-redux'
import Helmet from 'react-helmet'
import PageMeta from 'app/components/PageMeta'
import routes from 'app/routes'
import createStore from 'app/flux/stores'
import {setStateFromCookies} from 'app/flux/actions/me'
import template from 'app/template.html'
import NotFoundPage from 'app/components/Pages/Errors/NotFoundPage'
import ServerErrorPage from 'app/components/Pages/Errors/ServerErrorPage'

const renderPage = (html, store, sideEffects, statics) => {
  const initialState = JSON.stringify(store.getState())

  return template({
    html,
    initialState,
    statics,
    ...sideEffects,
    // passing GLOBALS defined by webpack to template
    GLOBALS,
  })
}

// rendering error page
// trying render smart page with profile etc
// and then pure page with just dumb text
const wrapErrorPage = (ErrorPage, store, statics) => (props = {}) => {
  try {
    return renderPage(renderToString(
      <Provider store={store} key="provider">
        <ErrorPage {...props} />
      </Provider>
    ), store, {}, statics)
  } catch (errorPageRenderingError) { // we need to go deeper!
    return wrapErrorPage(ServerErrorPage, store, statics)({
      error: errorPageRenderingError,
    })
  }
}

const getSideEffects = () => {
  const head = Helmet.rewind()
  // const pageMeta = PageMeta.rewind()
  // console.log(pageMeta, PageMeta, PageMeta.rewind())

  return {
    title: head.title.toString(),
    meta: head.meta.toString(),
    link: head.link.toString(),
    script: head.script.toString(),
    status: 200,
  }
}

export default function prerender(req, res, statics) {
  const history = createMemoryHistory(req.url)
  const {store} = createStore(history)

  const {
    cookies = {},
  } = req

  // restoring state from cookies flags
  setStateFromCookies(store.dispatch, cookies)

  // errors pages
  const serverError = wrapErrorPage(ServerErrorPage, store, statics)
  const notFoundPage = wrapErrorPage(NotFoundPage, store, statics)

  // server-side rendering at long last!
  match({routes, location: req.url}, (matchError, redirect, renderProps) => {
    if (matchError) {
      res.status(500).send(serverError({error: matchError}))
    }

    // react-router/es redirect on server-side
    if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    }

    if (renderProps) {
      // 1. load data
      loadOnServer({...renderProps, store}).then(() => {
        // 2. use `ReduxAsyncConnect` instead of `RoutingContext` and pass it `renderProps`
        const appHTML = renderToString(
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        )

        // side effects.
        const sideEffects = getSideEffects()

        // 3. render the Redux initial data into the server markup
        const html = renderPage(appHTML, store, sideEffects, statics)

        // 4. actual response with (probably) 200 status and html prerender
        res.status(sideEffects.status).send(html)
      })
      .catch((loadErr) => {
        res.status(500).send(serverError({error: loadErr}))
      })
    } else {
      res.status(404).send(notFoundPage())
    }
  })
}
