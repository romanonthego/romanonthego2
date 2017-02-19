import React, {PropTypes, PureComponent} from 'react'
import {connect} from 'react-redux'
import PageMeta from 'app/components/PageMeta'
import Helmet from 'bulletproof-react-helmet-es6'
import {asyncConnect} from 'redux-connect'
import {emptyLoader} from 'app/flux/loaders/async/empty'
import ControlPanel from 'app/components/Layout/ControlPanel.connector'
import omit from 'lodash/omit'
import RouteTransition from './RouteTransition'
import css from './Wrap.styl'

class Wrap extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }

  render() {
    const {
      location: {
        pathname,
      },
    } = this.props

    const props = omit(this.props, [
      'history',
      'location',
      'params',
      'route',
      'router',
      'empty',
      'routeParams',
      'routes',
      'dispatch',
    ])

    return (
      <PageMeta status={200}>
        <main className={css.wrap}>
          <Helmet
            title="romanonthego"
            description="romanonthego"
            website={{
              url: 'http://romanonthego.rocks',
              name: 'romanonthego',
            }}
            googleSiteVerification="52cc9HZNEX5Gd1dc_5G3XifhHYqZ5DKH0Xffngcd3PM"
          />

          <ControlPanel />

          <RouteTransition animated pathname={pathname}>
            <main className={css.wrappedRoute} {...props} />
          </RouteTransition>
        </main>
      </PageMeta>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = () => ({})

const WrapConnected = connect(mapStateToProps, mapDispatchToProps)(Wrap)

export default asyncConnect([
  emptyLoader,
])(WrapConnected)
