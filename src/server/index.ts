import { loadServerConfig, configureNeo4jDriver, configureNeode } from './config'
import { startServer, stopServer, verifyDriver } from './server'
import * as dotenv from 'dotenv'
//import Neode from 'neode'

const config = loadServerConfig()
console.log('config', config)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const driver = configureNeo4jDriver(config.neo4jUrl, config.neo4jUser, config.neo4jPass)
const driverVerification = verifyDriver(driver)

//const neodeInstance = configureNeode(config.neo4jUrl, neo4jUser, neo4jPass)
//const neodeInstance = Neode.fromEnv()

const server = startServer(config, driver)
server.then(instance => {
  process.on('SIGINT', async () => {
    stopServer(instance, driver)
  })
})
