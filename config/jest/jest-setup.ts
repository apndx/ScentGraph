import { loadServerConfig } from '../../src/server/config'
import { startServer } from '../../src/server/server'
import { configureNeo4jDriver } from '../../src/server/config'
require('dotenv').config()

export default async () => {

    const envParams = {
        PORT: '8000',
        NEO4J_URL: getUrl(process.env.NODE_ENV)  || 'bolt://localhost:7687',
        API_URL: 'http://localhost:5000',
    }
    process.env = {...process.env, ...envParams}
    const config = loadServerConfig()
    // @ts-ignore
    global.__APP_CONFIG__ = config

    const neoUser = getUser(process.env.NODE_ENV)
    const neoPass= getPass(process.env.NODE_ENV)

    const neoDriver = configureNeo4jDriver(process.env.NEO4J_URL, neoUser, neoPass)
    // @ts-ignore
    global.__NEO4J_DRIVER__ = neoDriver
    // @ts-ignore
    global.__EXPRESS_SERVER__ = await startServer(config, neoDriver)

}

function getUrl(env: string | undefined) {
  switch(env) {
    case 'test-local':
      return process.env.GRAPHENEDB_BOLT_URL
    case 'test-dev':
      return process.env.AURA_BOLT_URL
    case 'ci':
        return process.env.CI_BOLT_URL
    default:
      return 'bolt://localhost:7687'
  }
}

  function getUser(env: string | undefined) {
    switch(env) {
      case 'local':
        return process.env.GRAPHENEDB_BOLT_USER
      case 'dev':
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
      case 'dev':
        return process.env.AURA_PASSWORD
      case 'ci':
        return process.env.CI_BOLT_PASSWORD
      default:
        return ''
    }
  }
