import * as React from 'react'
import NavBarLayout from '../nav-bar-layout/nav-bar-layout'
import { EMPTY_STATE, DEFAULT_PROPS } from '../../utils'


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
