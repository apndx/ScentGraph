import * as React from 'react'
import { login } from '../../services/login'
import { ClientUser } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'
import { Notification } from '../../components'

interface LoginState {
  username: string,
  password: string,
  message: string
}

interface LoginProps {
  history: any,
  location: any,
  match: any
}

export class Login extends React.PureComponent<LoginProps, LoginState> {
  private timer
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      username: '',
      password: ''
    }
    this.timer = null
  }

  isDisabled(): boolean {
    return this.state && (this.state.username === '' || this.state.password === '')
  }

  onSubmit = event => {
    event.preventDefault()
    const userObject: ClientUser = {
      username: this.state.username,
      password: this.state.password
    }

    login(userObject)
      .then(response => {
        this.setState({ username: '', password: '' })
        this.props.history.push({
          pathname: '/',
          message: `Welcome ${response.user.name}!`
        })
      })
      .catch(message => {
        this.setMessage(`${message}`)
      })
  }

  public componentWillUnmount() {
    clearTimeout(this.timer)
  }

  private setMessage(message) {
    this.setState({ message: message })
    this.timer = setTimeout(() => {
      this.setState({ message: '' })
    }, 20000)
  }

  public render(): JSX.Element {
    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2 className='label'>Login</h2>
        <form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Label className='label'> Username </Form.Label>
            <Form.Control
              type='text'
              name='username'
              value={this.state.username}
              onChange={event => { this.setState({ username: event.target.value }) }}
              id='username'
            />

            <Form.Label className='label'> Password </Form.Label>
            <Form.Control
              type='password'
              name='password'
              value={this.state.password}
              onChange={event => { this.setState({ password: event.target.value }) }}
              id='password'
            />
            <p></p>
            <Button disabled={this.isDisabled()} variant='outline-info' type='submit'>Submit</Button>
          </Form.Group>
        </form>
        <style jsx>{`
        .label {
          margin-top: 12px;
          margin-bottom: 4px;
        }

        .container {
          margin-left: 60px;
        }

      `}</style>
      </div>
    )
  }
}
