import 'babel-polyfill'
import 'isomorphic-fetch'
import 'app/styles/app.styl'
import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'
import {ReduxAsyncConnect} from 'redux-connect'
import {AppContainer} from 'react-hot-loader'
import createStore from 'app/flux/stores'
import routes from 'app/routes'
import {trackPage} from 'app/utils/analytics/gaAction'

const {
  store,
  history,
} = createStore(browserHistory, window.__INITIAL_STATE__)

const App = () => {
  return (
    <Provider store={store} key="provider">
      <Router
        history={history}
        render={(props) => <ReduxAsyncConnect {...props} />}
      >
        {routes}
      </Router>
    </Provider>
  )
}

history.listen(() => {
  const {pathname, action} = history.getCurrentLocation()

  trackPage(pathname)

  if (action === 'POP') {
    window.scrollTo(0, 0)
  }
})

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('app')
  );
}

render(App)

if (module.hot) {
  module.hot.accept('./routes', () => {
    render(App)
  })
}
