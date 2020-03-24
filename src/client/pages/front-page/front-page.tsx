import * as React from 'react'
import { EMPTY_STATE } from '../../utils'
import NavBarLayout from '../nav-bar-layout/nav-bar-layout'
import { ClientUser } from '../../data-classes'

interface FrontPageLocation extends Location {
  state : {
    loginUser: ClientUser
  }
}

interface FrontPageProps {
  location: FrontPageLocation
}

export class FrontPage extends React.PureComponent<FrontPageProps, EMPTY_STATE> {
  constructor(props) {
    super(props)
  }

  public render(): JSX.Element {
    return (
      <div>
        <div>
          <NavBarLayout loginUser= {this.props.location.state && this.props.location.state.loginUser || null} />
        </div>
        <div className='container'>
          <h1>ScentGraph</h1>
        </div>
      </div>
    )
  }
}
