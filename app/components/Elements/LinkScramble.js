import React, {PureComponent, PropTypes} from 'react'
import {Link} from 'react-router/es'
import ExternalLink from './ExternalLink'
import TextScramble from './TextScramble'
// import cx from 'classnames'
// import css from './LinkScramble.styl'

export default class LinkScramble extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
  }

  render() {
    const {
      children,
      to,
      ...otherProps
    } = this.props

    let Element
    let elementProps = {}

    if (to.indexOf('http') > -1) {
      Element = ExternalLink
      elementProps = {'data-external': true}
    } else {
      Element = Link
    }

    return (
      <Element to={to} {...elementProps} {...otherProps}>
        <TextScramble element="span">
          {children}
        </TextScramble>
      </Element>
    )
  }
}
