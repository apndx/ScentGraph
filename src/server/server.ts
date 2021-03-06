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
  neodeInstance: any
): Promise<http.Server> {
  const app = express()
  app.use(bodyParser.json())
  const publicFilesPath = path.join(__dirname, config.publicPath)
  console.log(`Public files served from ${publicFilesPath}`)
  app.use(express.static(publicFilesPath))

  configureRoutes(app, neodeInstance, config)
  const server = app.listen(config.serverPort)
  console.log(`Server listening on port ${config.serverPort}`)
  return server
}

export function stopServer(
  server: http.Server,
  driver: neo4j.Driver,
  neodeInstance: any
) {
  console.log('Shutting down server')
  driver.close()
  neodeInstance.close()
  server.close()
}
