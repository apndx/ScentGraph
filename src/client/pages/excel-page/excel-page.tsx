import * as React from 'react'
import NavBarLayout from '../nav-bar-layout/nav-bar-layout'
import { EMPTY_STATE } from '../../utils'
import { Notification } from '../../components'

interface ExcelPageProps {
  history: any,
  location: ExcelPageLocation,
  match: any
}

interface ExcelPageLocation extends Location {
  message: string
}

export class ExcelPage extends React.Component<ExcelPageProps, EMPTY_STATE> {

  constructor(props) {
    super(props)
  }

  public render(): JSX.Element {
    return (
      <div>
        <div className='container'>
          <Notification message={this.props.location.message} />
        </div>
      </div>
    )
  }
}
