import * as neo4j from 'neo4j-driver'

export interface ServerConfig {
  env: string
  serverPort: number
  publicPath: string
  neo4jUrl: string
  neo4jUser: string
  neo4jPass: string
}

export function loadServerConfig(): ServerConfig {
  const serverConfig = {
    env: process.env.NODE_ENV || 'local',
    serverPort: parseInt(process.env.PORT as string, 10) || 3001,
    publicPath: '../../dist',
    apiUrl: process.env.API_URL || `http://localhost:3000`,
    neo4jUrl: process.env.AURA_BOLT_URL || 'bolt://localhost:7687',
    neo4jUser: process.env.AURA_USERNAME || 'neo4j',
    neo4jPass: process.env.AURA_PASSWORD || ''
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
