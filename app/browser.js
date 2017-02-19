import 'babel-polyfill'
import 'isomorphic-fetch'
import 'app/styles/app.styl'
import ReactDOM from 'react-dom'
import React from 'react'
import {browserHistory} from 'react-router'
import {ReduxAsyncConnect} from 'redux-connect'
import {AppContainer} from 'react-hot-loader'
import createStore from 'app/flux/stores'
import {trackPage} from 'app/utils/analytics/gaAction'

const {
  store,
  history,
} = createStore(browserHistory, window.__INITIAL_STATE__)

history.listen(() => {
  const {pathname, action} = history.getCurrentLocation()

  trackPage(pathname)

  if (action === 'POP') {
    window.scrollTo(0, 0)
  }
})

const routerRender = (props) => <ReduxAsyncConnect {...props} />

const render = () => {
  const App = require('app/components/App')
  const routes = require('app/routes')

  ReactDOM.render(
    <AppContainer>
      <App
        routerProps={{
          history,
          routes,
          render: routerRender,
        }}

        store={store}
      />
    </AppContainer>,
    document.getElementById('app')
  );
}

render()

if (module.hot) {
  module.hot.accept([
    'app/components/App',
    'app/routes',
  ], render)
}
