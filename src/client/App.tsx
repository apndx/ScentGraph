import React from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import {ClientRoutePath } from './routes'
import { FrontPage } from './pages/front-page'

export class App extends React.Component {
  public render():JSX.Element {
    return (
      <BrowserRouter>
        <Switch>
          <Route path ={ClientRoutePath.FrontPage} component={FrontPage} />
        </Switch>
      </BrowserRouter>
    )
  }
}
