import * as React from 'react'
import NavBarLayout from '../nav-bar-layout/nav-bar-layout'
import { EMPTY_STATE } from '../../utils'
import Notification from '../../components/notification'

interface FrontPageProps {
  history: any,
  location: FrontPageLocation,
  match: any
}

interface FrontPageLocation extends Location {
  message: string
}

export class FrontPage extends React.PureComponent<FrontPageProps, EMPTY_STATE> {
 
  constructor(props) {
    super(props)
  }

  public render(): JSX.Element {
    return (
      <div>
        <div>
          <NavBarLayout />
        </div>
        <div className='container'>
          <Notification message={this.props.location.message} />
          <h1>ScentGraph</h1>
        </div>
      </div>
    )
  }
}
