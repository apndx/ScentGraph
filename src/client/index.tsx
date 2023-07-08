import * as React from 'react'
import { render } from 'react-dom'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import { ClientRoutePath } from './routes'
import {
  FrontPage,
  UserCreate,
  Login,
  Logout,
  AdminTools,
  ScentCreate,
  ShowScents,
  NoteCreate,
  Current
} from './pages'
import 'bootstrap/dist/css/bootstrap.css'
import { SessionStorageItem } from '../client/utils'
import { ExternalRedirect } from '../client/components'

class App extends React.Component {

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
    window.removeEventListener('storage', this.handleStorageChange)
  }

  handleStorageChange(e) {
    const loggedUserJSON = window.sessionStorage.getItem(SessionStorageItem.LoginUser)
    if (loggedUserJSON) {
      const loginUser = JSON.parse(loggedUserJSON)
      this.setState({ loginUser })
    }
  }

  public render(): JSX.Element {

    return (
      <BrowserRouter >
        <Route path={ClientRoutePath.FrontPage} component={FrontPage} />
        <Switch>
        <Route exact path={ClientRoutePath.Current} component={Current} />
          <Route exact path={ClientRoutePath.NoteCreation} component={NoteCreate} />
          <Route exact path={ClientRoutePath.ScentCreation} component={ScentCreate} />
          <Route exact path={ClientRoutePath.ShowCategoryScents} component={ShowScents} />
          <Route exact path={ClientRoutePath.UserCreation} component={UserCreate} />
          <Route exact path={ClientRoutePath.AdminTools} component={AdminTools} />
          <Route exact path={ClientRoutePath.Login} component={Login} />
          <Route exact path={ClientRoutePath.Logout} component={Logout} />
          <ExternalRedirect exact={true}
            path={'/info'}
            link={'https://github.com/apndx/ScentGraph'} />
        </Switch>
      </BrowserRouter>
    )
  }
}

render(<App />, document.getElementById('root'))
