import { loadServerConfig, configureNeo4jDriver } from './config'
import { startServer, stopServer, verifyDriver } from './server'
import * as dotenv from 'dotenv'

const config = loadServerConfig()

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const neo4jUser = getUser(process.env.NODE_ENV) || 'neo4j'
const neo4jPass = getPass(process.env.NODE_ENV) || ''

const driver = configureNeo4jDriver(config.neo4jUrl, neo4jUser, neo4jPass)
verifyDriver(driver)

const server = startServer(config, driver)
server.then(instance => {
  process.on('SIGINT', async () => {
    stopServer(instance, driver)
  })
})


function getUser(env: string | undefined) {
  switch(env) {
    case 'local':
      return process.env.GRAPHENEDB_BOLT_USER
    case 'dev': case 'production':
      return process.env.AURA_USERNAME
    case 'ci':
      return process.env.CI_BOLT_USER
    default:
      return 'neo4j'
  }
}

function getPass(env: string | undefined) {
  switch(env) {
    case 'local':
      return process.env.GRAPHENEDB_BOLT_PASSWORD
    case 'dev': case 'production':
      return process.env.AURA_PASSWORD
    case 'ci':
      return process.env.CI_BOLT_PASSWORD
    default:
      return ''
  }
}
