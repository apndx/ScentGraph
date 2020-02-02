import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { configureUserRoutes } from './users/user-routes'

const API_PATH = '/api'

export function configureRoutes(
    app: express.Application,
    driver: neo4j.Driver
): void {
    configureUserRoutes(app, driver, API_PATH)
}
