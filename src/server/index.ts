import { loadServerConfig, configureNeo4jDriver } from './config'
import { startServer, stopServer, verifyDriver } from './server'
import * as dotenv from 'dotenv'

const config = loadServerConfig()

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const driver = configureNeo4jDriver(config.neo4jUrl, config.neo4jUser, config.neo4jPass)
const driverVerification = verifyDriver(driver)

const server = startServer(config, driver)
server.then(instance => {
  process.on('SIGINT', async () => {
    stopServer(instance, driver)
  })
})
