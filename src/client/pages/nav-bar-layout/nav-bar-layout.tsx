import * as React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import { withRouter } from 'react-router'
import logo from '../../assets/eye.jpg'

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
      <div >
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand>
          <img
            src={logo}
            width='60'
            height='60'
            className='d-inline-block align-top'
            alt='Helsingin Yliopisto'
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            
            <Nav.Link href='#' as='span'>
              <Link className='text-info' style={this.state.padding} to='/'>Front page</Link>
            </Nav.Link>

            <Nav.Link href='#' as='span'>
              <Link className='text-info' style={this.state.padding} to='/newUser'>Add a user</Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
    )
  }

}

export default withRouter(NavBarLayout)
