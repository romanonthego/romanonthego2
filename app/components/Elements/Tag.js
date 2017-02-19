import React, {PureComponent, PropTypes} from 'react'
import TextScramble from './TextScramble'
import css from './Tag.styl'

export default class Tag extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    element: PropTypes.oneOf([PropTypes.string, PropTypes.func]),
  }

  static defaultProps = {
    element: 'span',
  }

  // state = {
  //
  // }

  render() {
    const {
      element: Element,
      children,
    } = this.props

    return (
      <Element className={css.tag}>
        <TextScramble element="span">
          {children}
        </TextScramble>
      </Element>
    )
  }
}
