import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { SessionStorageItem } from '../../utils'
import { ClientRoutePath } from '../../routes'

interface LogoutPageLocation extends Location {
  state: {
    from?: Location
  }
}

interface LogoutProps extends RouteComponentProps<any> {
  location: LogoutPageLocation
}

interface LogoutState {
  errorMessage?: string
}

export class Logout extends React.PureComponent<LogoutProps, LogoutState> {
  public state: LogoutState

  constructor(props: Readonly<LogoutProps>) {
    super(props)
    this.state = {
      errorMessage: null
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
        state: {
          loginUser: null
        }
      })
    } catch (e) {
      this.setState({ errorMessage: 'Logout was not successful' })
    }
  }

  public render(): JSX.Element {
    return (<></>)
  }
}
