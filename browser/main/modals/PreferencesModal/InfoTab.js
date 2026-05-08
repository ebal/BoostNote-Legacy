import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './InfoTab.styl'
import ConfigManager from 'browser/main/lib/ConfigManager'
import i18n from 'browser/lib/i18n'

const electron = require('electron')
const { shell, remote } = electron
const appVersion = remote.app.getVersion()

class InfoTab extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      config: this.props.config,
      subscriptionFormStatus: 'idle',
      subscriptionFormErrorMessage: null,
      subscriptionFormEmail: ''
    }
  }

  componentDidMount() {
    const { autoUpdateEnabled } = ConfigManager.get()

    this.setState({ config: { autoUpdateEnabled } })
  }

  handleLinkClick(e) {
    shell.openExternal(e.currentTarget.href)
    e.preventDefault()
  }

  handleConfigChange(e) {
    const newConfig = {
      autoUpdateEnabled: this.refs.autoUpdateEnabled.checked
    }

    this.setState({ config: newConfig })
    return newConfig
  }

  handleSubscriptionFormSubmit(e) {
    e.preventDefault()
    this.setState({
      subscriptionFormStatus: 'sending',
      subscriptionFormErrorMessage: null
    })

    fetch(
      'https://boostmails.boostio.co/api/public/lists/5f434dccd05f3160b41c0d49/subscriptions',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ email: this.state.subscriptionFormEmail })
      }
    )
      .then(response => {
        if (response.status >= 400) {
          return response.text().then(text => {
            throw new Error(text)
          })
        }
        this.setState({
          subscriptionFormStatus: 'done'
        })
      })
      .catch(error => {
        this.setState({
          subscriptionFormStatus: 'idle',
          subscriptionFormErrorMessage: error.message
        })
      })
  }

  handleSubscriptionFormEmailChange(e) {
    this.setState({
      subscriptionFormEmail: e.target.value
    })
  }

  handleAutoUpdateChange() {
    const { autoUpdateEnabled } = this.handleConfigChange()

    ConfigManager.set({ autoUpdateEnabled })
  }

  render() {
    return (
      <div styleName='root'>
        <div styleName='group-header'>{i18n.__('Community')}</div>
        <div styleName='top'>
          <ul styleName='list'>
            <li>
              <a
                href='https://issuehunt.io/repos/53266139'
                onClick={e => this.handleLinkClick(e)}
              >
                {i18n.__('Bounty on IssueHunt')}
              </a>
            </li>
            <li>
              <a
                href='https://boostnote.io/#subscribe'
                onClick={e => this.handleLinkClick(e)}
              >
                {i18n.__('Subscribe to Newsletter')}
              </a>
            </li>
            <li>
              <a
                href='https://github.com/BoostIO/Boostnote/issues'
                onClick={e => this.handleLinkClick(e)}
              >
                {i18n.__('GitHub')}
              </a>
            </li>
            <li>
              <a
                href='https://medium.com/boostnote'
                onClick={e => this.handleLinkClick(e)}
              >
                {i18n.__('Blog')}
              </a>
            </li>
            <li>
              <a
                href='https://www.facebook.com/groups/boostnote'
                onClick={e => this.handleLinkClick(e)}
              >
                {i18n.__('Facebook Group')}
              </a>
            </li>
            <li>
              <a
                href='https://twitter.com/boostnoteapp'
                onClick={e => this.handleLinkClick(e)}
              >
                {i18n.__('Twitter')}
              </a>
            </li>
          </ul>
        </div>

        <hr />

        <div styleName='group-header--sub'>Subscribe Update Notes</div>
        {this.state.subscriptionFormStatus === 'done' ? (
          <div>
            <blockquote color={{ color: 'green' }}>
              Thanks for the subscription!
            </blockquote>
          </div>
        ) : (
          <div>
            {this.state.subscriptionFormErrorMessage != null && (
              <blockquote style={{ color: 'red' }}>
                {this.state.subscriptionFormErrorMessage}
              </blockquote>
            )}
            <form onSubmit={e => this.handleSubscriptionFormSubmit(e)}>
              <input
                styleName='subscription-email-input'
                placeholder='E-mail'
                type='email'
                onChange={e => this.handleSubscriptionFormEmailChange(e)}
                disabled={this.state.subscriptionFormStatus === 'sending'}
              />
              <button
                styleName='subscription-submit-button'
                type='submit'
                disabled={this.state.subscriptionFormStatus === 'sending'}
              >
                Subscribe
              </button>
            </form>
          </div>
        )}
        <hr />

        <div styleName='group-header--sub'>{i18n.__('About')}</div>

        <div styleName='top'>
          <div styleName='icon-space'>
            <img
              styleName='icon'
              src='../resources/app.png'
              width='92'
              height='92'
            />
            <div styleName='icon-right'>
              <div styleName='appId'>Boostnote Legacy {appVersion}</div>
              <div styleName='description'>
                {i18n.__(
                  'An open source note-taking app made for programmers just like you.'
                )}
              </div>
            </div>
          </div>
        </div>

        <ul styleName='list'>
          <li>
            <a
              href='https://boostnote.io'
              onClick={e => this.handleLinkClick(e)}
            >
              {i18n.__('Website')}
            </a>
          </li>
          <li>
            <a
              href='https://github.com/BoostIO/Boostnote/blob/master/docs/build.md'
              onClick={e => this.handleLinkClick(e)}
            >
              {i18n.__('Development')}
            </a>
            {i18n.__(' : Development configurations for Boostnote.')}
          </li>
          <li styleName='cc'>{i18n.__('Copyright (C) 2017 - 2020 BoostIO')}</li>
          <li styleName='cc'>{i18n.__('License: GPL v3')}</li>
        </ul>

        <div>
          <label>
            <input
              type='checkbox'
              ref='autoUpdateEnabled'
              onChange={() => this.handleAutoUpdateChange()}
              checked={this.state.config.autoUpdateEnabled}
            />
            {i18n.__('Enable Auto Update')}
          </label>
        </div>
      </div>
    )
  }
}

InfoTab.propTypes = {}

export default CSSModules(InfoTab, styles)
