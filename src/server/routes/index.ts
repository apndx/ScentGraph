import * as express from 'express'
import { configureUserRoutes } from './users/user-routes'
import { configureLoginRoutes } from './login/login-routes'
import { configureScentRoutes } from './scents/scent-routes'
import {
  configureGenderRoutes,
  configureSeasonRoutes,
  configureTimeOfDayRoutes,
  configureCategoryRoutes
} from './admin-scent-details'
import { ServerConfig } from '../config'
import { configureRouteNotFoundMiddleware } from '../../server/middleware'

const API_PATH = '/api'

export function configureRoutes(
  app: express.Application,
  neode: any,
  config: ServerConfig
): void {
  configureUserRoutes(app, neode, API_PATH)
  configureLoginRoutes(app, neode, API_PATH)
  configureScentRoutes(app, neode, API_PATH)
  configureTimeOfDayRoutes(app, neode, API_PATH)
  configureSeasonRoutes(app, neode, API_PATH)
  configureGenderRoutes(app, neode, API_PATH)
  configureCategoryRoutes(app, neode, API_PATH)
  configureRouteNotFoundMiddleware(config, app, API_PATH)  // this should be last
}
