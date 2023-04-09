import { loadServerConfig, configureNeo4jDriver } from './config'
import { startServer, stopServer, verifyDriver } from './server'
import * as dotenv from 'dotenv'

const config = loadServerConfig()

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}
const neo4jUser = process.env.AURA_USERNAME || 'neo4j'
const neo4jPass = process.env.AURA_PASSWORD || ''

const driver = configureNeo4jDriver(config.neo4jUrl, neo4jUser, neo4jPass)
const driverVerification = verifyDriver(driver)

const server = startServer(config, driver)
server.then(instance => {
  process.on('SIGINT', async () => {
    stopServer(instance, driver)
  })
})
