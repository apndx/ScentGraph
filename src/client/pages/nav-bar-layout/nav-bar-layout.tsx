import * as React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'
import { withRouter } from 'react-router'  

interface NavBarLayoutProps {
  history: any,
  location: any,
  match: any
}


interface NavBarLayoutState {
  padding: any,
  navStyle: any
}

class NavBarLayout extends React.PureComponent<NavBarLayoutProps, NavBarLayoutState> {
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

export default withRouter(NavBarLayout)
