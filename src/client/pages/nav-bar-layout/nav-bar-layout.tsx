import * as React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import { withRouter } from 'react-router'
import logo from '../../assets/eye.jpg'
import { EMPTY_STATE, SessionStorageItem } from '../../utils'

interface NavBarLayoutProps {
  history: any,
  location: any,
  match: any
}


class NavBarLayout extends React.PureComponent<NavBarLayoutProps, EMPTY_STATE> {
  public padding: any
  constructor(props) {
    super(props)
  }

  isLogged() {
    return window.sessionStorage.getItem(SessionStorageItem.LoginUser)
  }

  isAdmin(): boolean {
    return window.sessionStorage.getItem(SessionStorageItem.LoginRole) === 'admin'
  }

  public renderUserLogged(): JSX.Element {
    return (
      <div >
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">

            <Nav.Link href='#' as='span'>
              {this.isAdmin() ?
                <Link className='text-info' to='/adminTools'>Add an item</Link>
                : <em></em>}
            </Nav.Link>

            <Nav.Link href='#' as='span'>
              <Link className='text-info' to='/scentCreate'>Create a Scent</Link>
            </Nav.Link>

            <Nav.Link href='#' as='span'>
              <Link className='text-info' to='/logout'>Logout</Link>
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </div>
    )
  }

  public renderNoLogin(): JSX.Element {
    return (
      <div >
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">

            <Nav.Link href='#' as='span'>
              <Link className='text-info' to='/newUser'>Add a user</Link>
            </Nav.Link>

            <Nav.Link href='#' as='span'>
              <Link className='text-info' to='/login'>Login</Link>
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </div>
    )
  }

  noLogin(): JSX.Element {
    return (
      !this.isLogged() && this.renderNoLogin()
    )
  }

  userLogged(): JSX.Element {
    return (
      this.isLogged() && this.renderUserLogged()
    )
  }

  public render(): JSX.Element {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand>
            <Link className='front-page' to='/'>
              <img
                src={logo}
                width='60'
                height='60'
                className='d-inline-block align-top'
                alt='Water colour eye logo'
              />
            </Link>
          </Navbar.Brand>

          <Nav.Link href='#' as='span'>
            <Link className='text-info' to='/scentsFromCategory'>Show Scents</Link>
          </Nav.Link>

          {this.noLogin()}  {this.userLogged()}
        </Navbar>
      </div>
    )
  }

}

export default withRouter(NavBarLayout)
