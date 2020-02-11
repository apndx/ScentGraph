import * as React from 'react'
import { DEFAULT_PROPS } from '../../utils'
import { create } from '../../services/users'
import { ClientUser } from '../../data-classes'

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
      <div>
        <h2>Add a new user</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            Name
              <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={(event) => { this.setState({ name: event.target.value }) }}
            />
          </div>
          <div>
            Username
              <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={(event) => { this.setState({ username: event.target.value }) }}
            />
          </div>
          <div>
            Password
              <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={(event) => { this.setState({ password: event.target.value }) }}
            />
          </div>
          <button
            disabled={this.isDisabled()}>save</button>
        </form>
      </div>
    )
  }
}


