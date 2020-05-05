import * as React from 'react'
import { login } from '../../services/login'
import { ClientUser } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'
import Notification from '../../components/notification'

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

  onSubmit = (event) => {
    event.preventDefault()
    const userObject: ClientUser = {
      username: this.state.username,
      password: this.state.password
    }

    login(userObject)
      .then(response => {
        console.log(`Welcome ${response.user.name}!`)
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
        <h2>Login</h2>
        <form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Label> Username </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={this.state.username}
              onChange={(event) => { this.setState({ username: event.target.value }) }}
              id='username'
            />

            <Form.Label> Password </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={this.state.password}
              onChange={(event) => { this.setState({ password: event.target.value }) }}
              id='password'
            />

            <Button disabled={this.isDisabled()} variant="outline-info" type="submit">Submit</Button>
          </Form.Group>
        </form>
      </div>
    )
  }
}
