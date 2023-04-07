import * as express from 'express'
import * as neo4j from 'neo4j-driver'
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
  driver: neo4j.Driver,
  config: ServerConfig
): void {
  configureUserRoutes(app, driver, API_PATH)
  configureLoginRoutes(app, driver, API_PATH)
  configureScentRoutes(app, driver, API_PATH)
  configureTimeOfDayRoutes(app, driver, API_PATH)
  configureSeasonRoutes(app, driver, API_PATH)
  configureGenderRoutes(app, driver, API_PATH)
  configureCategoryRoutes(app, driver, API_PATH)
  configureBrandRoutes(app, driver, API_PATH)
  configureNoteRoutes(app, driver, API_PATH)
  configureGraphRoutes(app, driver, API_PATH)
  configureRouteNotFoundMiddleware(config, app, API_PATH)  // this should be last
}

export * from './route-helpers'
