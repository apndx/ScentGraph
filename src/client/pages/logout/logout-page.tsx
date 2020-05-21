import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { SessionStorageItem } from '../../utils'
import { ClientRoutePath } from '../../routes'
import { Notification } from '../../components'

interface LogoutProps extends RouteComponentProps<any> {
  history: any
}

interface LogoutState {
  message: string
}

export class Logout extends React.PureComponent<LogoutProps, LogoutState> {
  public state: LogoutState

  constructor(props: Readonly<LogoutProps>) {
    super(props)
    this.state = {
      message: ''
    }
  }

  public componentDidMount() {
    this.logOut()
  }

  private async logOut(): Promise<void> {
    try {
      sessionStorage.removeItem(SessionStorageItem.Authorization)
      sessionStorage.removeItem(SessionStorageItem.LoginUser)
      this.props.history.push({
        pathname: ClientRoutePath.FrontPage,
        message: 'See you soon!'
      })
    } catch (e) {
      this.setState({ message: 'Logout was not successful' })
    }
  }

  public render(): JSX.Element {
    return (
      <Notification message={this.state.message} />
    )
  }

}
