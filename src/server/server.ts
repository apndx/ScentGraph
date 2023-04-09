import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import * as path from 'path'
import * as http from 'http'
import * as bodyParser from 'body-parser'
import { ServerConfig } from './config'
import { configureRoutes } from './routes'

export async function startServer(
  config: ServerConfig,
  driver: neo4j.Driver,
): Promise<http.Server> {
  const app = express()
  app.use(bodyParser.json())
  const publicFilesPath = path.join(__dirname, config.publicPath)
  console.log(`Public files served from ${publicFilesPath}`)
  app.use(express.static(publicFilesPath))

  configureRoutes(app, driver, config)
  const server = app.listen(config.serverPort)
  console.log(`Server listening on port ${config.serverPort}`)
  return server
}

export function stopServer(
  server: http.Server,
  driver: neo4j.Driver,
) {
  console.log('Shutting down server')
  driver.close()
  server.close()
}

export async function verifyDriver(
  driver: neo4j.Driver
) {
    try {
      await driver.verifyConnectivity()
      console.log('Driver created')
    } catch (error) {
      console.log(`connectivity verification failed. ${error}`)
    }
  }
