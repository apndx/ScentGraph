import * as React from 'react'
import { DEFAULT_PROPS, EMPTY_STATE } from '../../utils'
import NavBarLayout from '../nav-bar-layout/nav-bar-layout'

export class FrontPage extends React.PureComponent<DEFAULT_PROPS, EMPTY_STATE> {
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
          <h1>ScentGraph</h1>
        </div>
      </div>
    )
  }
}
