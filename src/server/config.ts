import * as neo4j from 'neo4j-driver'

export interface ServerConfig {
  env: string
  serverPort: number
  publicPath: string
  neo4jUrl: string
}

export function loadServerConfig(): ServerConfig {
  const serverConfig = {
    env: process.env.NODE_ENV || 'local',
    serverPort: parseInt(process.env.PORT as string, 10) || 3001,
    publicPath: '../../dist',
    apiUrl: process.env.API_URL || `http://localhost:3000`,
    neo4jUrl: getUrl(process.env.NODE_ENV) || 'bolt://localhost:7687',
  }
  return serverConfig
}

export function configureNeo4jDriver(
  url: any,
  username: any,
  password: any
): neo4j.Driver {
  const driver = neo4j.driver(url, neo4j.auth.basic(username, password))
  return driver
}

function getUrl(env: string | undefined) {
  switch(env) {
    case 'local':
      return process.env.GRAPHENEDB_BOLT_URL
    case 'dev': case 'test':
      return process.env.AURA_BOLT_URL
    default:
      return 'bolt://localhost:7687'
  }
}
