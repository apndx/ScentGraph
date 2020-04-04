import * as React from 'react'
import { DEFAULT_PROPS, SessionStorageItem } from '../../utils'
import { login } from '../../services/login'
import { ClientUser } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'

interface LoginState {
  username: string,
  password: string,
  errorMessage?: string
}

export class Login extends React.PureComponent<DEFAULT_PROPS, LoginState> {
  constructor(props) {
    super(props)
    this.state = {
      errorMessage: null,
      username: '',
      password: ''
    }
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
        window.sessionStorage.setItem(SessionStorageItem.LoginRole, response.user.role)
        window.sessionStorage.setItem(SessionStorageItem.LoginUser, response.user.username)
        window.sessionStorage.setItem(SessionStorageItem.Authorization, response.token)
        this.props.history.push({
          pathname: '/'
        })
      })
      .catch(success => {
        console.log(`something went wrong on login page..`)
      })

  }

  public render(): JSX.Element {
    return (
      <div className='container'>
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
