import { loadServerConfig, configureNeo4jDriver, configureNeode } from './config'
import { startServer, stopServer, verifyDriver } from './server'
import * as dotenv from 'dotenv'

const config = loadServerConfig()

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const neodeUser = process.env.AURA_USER || ''
const neodePass =process.env.AURA_PASSWORD || ''

const driver = configureNeo4jDriver(config.neo4jUrl, neodeUser ,neodePass)


const neodeInstance = configureNeode(config.neo4jUrl, neodeUser, neodePass)

const driverVerification = verifyDriver(driver)

const server = startServer(config, driver, neodeInstance)
server.then(instance => {
  process.on('SIGINT', async () => {
    stopServer(instance, driver, neodeInstance)
  })
})
