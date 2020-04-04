import * as React from 'react'
import { SessionStorageItem } from '../../utils'
import NavBarLayout from '../nav-bar-layout/nav-bar-layout'
import { ClientUser } from '../../../common/data-classes'

interface FrontPageLocation extends Location {
  state : {
    loginUser: ClientUser
  }
}

interface FrontPageState {
  loginUser: ClientUser
}

interface FrontPageProps {
  location: FrontPageLocation
}

export class FrontPage extends React.PureComponent<FrontPageProps, FrontPageState> {
  constructor(props) {
    super(props)
    this.state = {
       loginUser: null
    }
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
      <div>
        <div>
          <NavBarLayout loginUser= {this.state && this.state.loginUser || null} />
        </div>
        <div className='container'>
          <h1>ScentGraph</h1>
        </div>
      </div>
    )
  }
}
