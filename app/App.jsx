import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'
import {ReduxAsyncConnect} from 'redux-connect'
import createStore from 'app/flux/stores'
import routes from 'app/routes'

const {
  store,
  history,
} = createStore(browserHistory, window.__INITIAL_STATE__)

export {history}

export default function App() {
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