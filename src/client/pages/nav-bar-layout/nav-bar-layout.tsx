import * as React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import { withRouter } from 'react-router'
import logo from '../../assets/eye.jpg'
import { EMPTY_STATE } from '../../utils'

interface NavBarLayoutProps {
  history: any,
  location: any,
  match: any
}


class NavBarLayout extends React.PureComponent<NavBarLayoutProps, EMPTY_STATE> {
  public padding: any
  constructor(props) {
    super(props)
    this.padding = { padding: 10 }
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
              alt='Water colour eye logo'
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">

              <Nav.Link href='#' as='span'>
                <Link className='text-info' style={this.padding} to='/'>Front page</Link>
              </Nav.Link>

              <Nav.Link href='#' as='span'>
                <Link className='text-info' style={this.padding} to='/newUser'>Add a user</Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }

}

export default withRouter(NavBarLayout)
