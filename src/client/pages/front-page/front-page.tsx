import * as React from 'react'
import NavBarLayout from '../nav-bar-layout/nav-bar-layout'
import { EMPTY_STATE } from '../../utils'
import Notification from '../../components/notification'

interface NavBarLayoutProps {
  message: string,
  history: any,
  location: any,
  match: any
}

export class FrontPage extends React.PureComponent<NavBarLayoutProps, EMPTY_STATE> {
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
          <Notification message={this.props.message} />
          <h1>ScentGraph</h1>
        </div>
      </div>
    )
  }
}
