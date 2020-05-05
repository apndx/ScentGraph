import * as React from 'react'
import { createUser } from '../../services/users'
import { ClientUser } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'
import Notification from '../../components/notification'

interface UserCreateState {
  message: string,
  name: string,
  username: string,
  password: string
}

interface UserCreateProps {
  history: any,
  location: any,
  match: any
}

export class UserCreate extends React.PureComponent<UserCreateProps, UserCreateState> {
  private timer
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      name: '',
      username: '',
      password: ''
    }
    this.timer = null
  }

  isDisabled(): boolean {
    return this.state && (this.state.name === '' || this.state.username.length < 5 || this.state.password.length < 8)
  }

  onSubmit = (event) => {
    event.preventDefault()
    const userObject: ClientUser = {
      name: this.state.name,
      username: this.state.username,
      password: this.state.password
    }

    createUser(userObject)
      .then(response => {
        this.setState({
          name: '', username: '', password: ''
        })
        this.props.history.push({
          pathname: '/',
          message: `User added: ${response.body}`
        })
      })
      .catch(message => {
        this.setMessage(`${message}`)
      })

  }

  private setMessage(message) {
    this.setState({ message: message })
    this.timer = setTimeout(() => {
      this.setState({ message: '' })
    }, 20000)
  }

  public componentWillUnmount() {
    clearTimeout(this.timer)
  }

  public render(): JSX.Element {
    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Add a new user</h2>
        <form onSubmit={this.onSubmit}>
          <Form.Group>

            <Form.Label> Name </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={this.state.name}
              onChange={(event) => { this.setState({ name: event.target.value }) }}
              id='name'
            />

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

            <Button disabled={this.isDisabled()} variant="outline-info" type="submit">save</Button>
          </Form.Group>
        </form>
      </div>
    )
  }
}
