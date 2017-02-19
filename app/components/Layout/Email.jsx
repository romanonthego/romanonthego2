import React, {PureComponent, PropTypes} from 'react'
import TextScramble from 'app/components/Elements/TextScramble'
import css from './Email.styl'
import connector from './Email.connector'

const data = {
  provider: [
    'gmail.com',
    'yahoo.com',
    'yandex.com',
  ],
  name: [
    'johndoe',
    'romanonthego',
    'denisyevgen',
    'stepanlech',
    'illarion',
  ],
}

const getNextItem = (key, currentValue) => {
  const items = data[key]
  const index = items.indexOf(currentValue)
  let nextIndex = index + 1

  if (nextIndex >= items.length) {
    nextIndex = 0
  }

  return items[nextIndex]
}

class Email extends PureComponent {
  static propTypes = {
    emailUncovered: PropTypes.bool.isRequired,
    setEmailUncovered: PropTypes.func.isRequired,
  }

  state = {
    uncovered: this.props.emailUncovered,
    provider: getNextItem('provider', 0),
    name: getNextItem('name', 0),
  }

  handleUncover = (event) => {
    if (!this.state.uncovered) {
      this.setState({
        uncovered: true,
      }, () => {
        this.props.setEmailUncovered(true)
      })

      event.preventDefault()
      return false
    }

    return true
  }

  handleEmailScramble = (key) => {
    return () => {
      if (this.state.uncovered) {
        return
      }

      this.setState({
        [key]: getNextItem(key, this.state[key]),
      })
    }
  }

  render() {
    const {
      uncovered,
      name,
      // provider,
    } = this.state

    const hintText = uncovered ? 'okay, you are human' : 'click to uncover email'

    const linkProps = uncovered ? {
      href: 'mailto:romanonthego@gmail.com',
    } : {
      'data-use-title': true,
      'data-title': 'You are not robot, are you?',
    }

    return (
      <a
        {...linkProps}
        onClick={this.handleUncover}
        tabIndex={0}
        className={css.link}
        data-tooltip-position="top"
      >
        <span className={css.hint}>
          <TextScramble>{hintText}</TextScramble>
        </span>

        <TextScramble
          element="span"
          onDone={this.handleEmailScramble('name')}
          onDoneTimeout={3600}
        >
          {uncovered ? 'romanonthego' : name}
        </TextScramble>
        @
        <TextScramble
          element="span"
        >
          gmail.com
        </TextScramble>
      </a>
    )
  }
}

export default connector(Email)
