import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'
import { DEFAULT_PROPS } from '../../utils'

interface NavBarLayoutState {
  padding: any,
  navStyle: any
}

export class NavBarLayout extends React.PureComponent<DEFAULT_PROPS, NavBarLayoutState> {
  public state: NavBarLayoutState
  constructor(props) {
    super(props)
    this.state = {
      padding: { padding: 10 },
      navStyle: {
        color: 'grey',
        paddingLeft: 10,
        paddingRight: 10,
      }
    }
  }

  public render(): JSX.Element {
    return (
      <Navbar bg='dark' variant='dark'>
        <div style={this.state.navStyle}>
          <Link style={this.state.padding} to="/">Front page</Link>
          <Link style={this.state.padding} to="/newUser">Add a user</Link>
        </div>
      </Navbar>
    )
  }

}





