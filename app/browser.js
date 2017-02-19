// import 'babel-polyfill'
import 'isomorphic-fetch'
import 'app/styles/app.styl'
import ReactDOM from 'react-dom'
import React from 'react'
import {AppContainer} from 'react-hot-loader'
import {trackPage} from 'app/utils/analytics/gaAction'
import App, {history} from './App'

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('app')
  )
}

render(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}

history.listen(() => {
  const {pathname, action} = history.getCurrentLocation()

  trackPage(pathname)

  if (action === 'POP') {
    window.scrollTo(0, 0)
  }
})
