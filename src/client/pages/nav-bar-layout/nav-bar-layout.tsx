import * as React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import { withRouter } from 'react-router'
import logo from '../../assets/eye.jpg'
import { SessionStorageItem } from '../../utils'
import { ClientUser } from '../../../common/data-classes'

interface NavBarLayoutProps {
  history: any,
  location: any,
  match: any,
  loginUser: ClientUser
}

interface NavBarLayoutState {
  loginUser: ClientUser
}

class NavBarLayout extends React.PureComponent<NavBarLayoutProps, NavBarLayoutState > {
  public padding: any
  constructor(props) {
    super(props)
    this.state = {
      loginUser: null
   }
    this.padding = { padding: 10 }
    this.handleStorageChange = this.handleStorageChange.bind(this)
  }

  componentDidMount() {
    window.addEventListener('storage', this.handleStorageChange)
  } 
  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
  }

  handleStorageChange(e) {
    console.log('STORAGE')
    const loggedUserJSON = window.sessionStorage.getItem(SessionStorageItem.LoginUser)
    console.log('LOG', loggedUserJSON)
    if (loggedUserJSON) {
      const loginUser = JSON.parse(loggedUserJSON)
      this.setState({loginUser})
    } 
  }

  public render(): JSX.Element {
    return (
      <div >
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand>
            <Link className='front-page' style={this.padding} to='/'>
              <img
                src={logo}
                width='60'
                height='60'
                className='d-inline-block align-top'
                alt='Water colour eye logo'
              />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">

              <Nav.Link href='#' as='span'>
                {this.state.loginUser ? <em></em>
                  : <Link className='text-info' style={this.padding} to='/newUser'>Add a user</Link>}
              </Nav.Link>

              <Nav.Link href='#' as='span'>
                {this.state.loginUser && this.state.loginUser.role === 'admin' ? 
                <Link className='text-info' style={this.padding} to='/adminTools'>Add an item</Link>
                  : <em></em>}
              </Nav.Link>

              <Nav.Link href='#' as='span'>
                {this.state.loginUser ? <em></em>
                  : <Link className='text-info' style={this.padding} to='/login'>Login</Link>}
              </Nav.Link>

              <Nav.Link href='#' as='span'>
                {this.state.loginUser ? <Link className='text-info' style={this.padding} to='/logout'>Logout</Link>
                  : <em></em>}
              </Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }

}

export default withRouter(NavBarLayout)
