import { loadServerConfig, configureNeo4jDriver, configureNeode } from './config'
import { startServer, stopServer } from './server'
import * as dotenv from 'dotenv'
import Neode from 'neode'

const config = loadServerConfig()

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const neo4jUser = process.env.AURA_USERNAME
const neo4jPass = process.env.AURA_PASSWORD
const driver = configureNeo4jDriver(config.neo4jUrl, neo4jUser, neo4jPass)

//const neodeInstance = configureNeode(config.neo4jUrl, neo4jUser, neo4jPass)
const neodeInstance = Neode.fromEnv()

const server = startServer(config, driver, neodeInstance)
server.then(instance => {
  process.on('SIGINT', async () => {
    stopServer(instance, driver, neodeInstance)
  })
})
