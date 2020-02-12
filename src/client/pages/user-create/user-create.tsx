import * as React from 'react'
import { DEFAULT_PROPS } from '../../utils'
import { create } from '../../services/users'
import { ClientUser } from '../../data-classes'
import { Form, Button } from 'react-bootstrap'

interface UserCreateState {
  name: string,
  username: string,
  password: string
}

export class UserCreate extends React.PureComponent<DEFAULT_PROPS, UserCreateState> {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: '',
      password: ''
    }
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

    create(userObject)
      .then(response => {
        console.log(`user added: ' ${response.body} ' `)
        this.setState({
          name: '', username: '', password: ''
        })
        this.props.history.push('/')
      })
      .catch(success => {
        console.log(`something went wrong..`)
      })

  }

  public render(): JSX.Element {
    return (
      <div className='container'>
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
