import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { configureUserRoutes } from './users/user-routes'
import { configureLoginRoutes } from './login/login-routes'
import { ServerConfig } from '../config'
import { configureRouteNotFoundMiddleware } from '../../server/middleware'

const API_PATH = '/api'

export function configureRoutes(
    app: express.Application,
    driver: neo4j.Driver,
    config: ServerConfig
): void {
    configureUserRoutes(app, driver, API_PATH)
    configureLoginRoutes(app, API_PATH)
    configureRouteNotFoundMiddleware(config, app, API_PATH)
}
