import React, {PureComponent} from 'react'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'

export default class App extends PureComponent {
  render() {
    const {store, routerProps} = this.props

    return (
      <Provider store={store}>
        <Router {...routerProps} />
      </Provider>
    )
  }
}
