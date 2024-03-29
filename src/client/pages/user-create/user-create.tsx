import * as React from 'react'
import { createUser } from '../../services/users'
import { ClientUser } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'
import { Notification } from '../../components'

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

  onSubmit = event => {
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
          message: response
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
        <h2 className='label'>Add a new user</h2>
        <form onSubmit={this.onSubmit}>
          <Form.Group>

            <Form.Label className='label'> Name </Form.Label>
            <Form.Control
              type='text'
              name='name'
              value={this.state.name}
              onChange={event => { this.setState({ name: event.target.value }) }}
              id='name'
            />

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

            <Button className='button' disabled={this.isDisabled()} variant='outline-info' type='submit'>save</Button>
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

        .button {
          margin-top: 16px;
        }

      `}</style>
      </div>
    )
  }
}
