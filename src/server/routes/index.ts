import * as express from 'express'
import { configureUserRoutes } from './users/user-routes'
import { configureLoginRoutes } from './login/login-routes'
import { configureScentRoutes } from './scents/scent-routes'
import { configureBrandRoutes } from './scents/brand-routes'
import { configureNoteRoutes } from './scents/note-routes'
import { configureGraphRoutes } from './graph/graph-routes'
import {
  configureGenderRoutes,
  configureSeasonRoutes,
  configureTimeOfDayRoutes,
  configureCategoryRoutes,
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
  configureBrandRoutes(app, neode, API_PATH)
  configureNoteRoutes(app, neode, API_PATH)
  configureGraphRoutes(app, neode, API_PATH)
  configureRouteNotFoundMiddleware(config, app, API_PATH)  // this should be last
}

export * from './route-helpers'
