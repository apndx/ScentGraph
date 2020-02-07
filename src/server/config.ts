import * as neo4j from "neo4j-driver"

export interface ServerConfig {
  env: string
  serverPort: number
  publicPath: string
  neo4jUrl: string
}

export function loadServerConfig(): ServerConfig {
  const serverConfig = {
    env: process.env.NODE_ENV || "local",
    serverPort: parseInt(process.env.SERVER_PORT as string, 10),
    publicPath: "../..dist",
    neo4jUrl: process.env.NEO4J_URL || 'bolt://localhost:7687'
  }
  return serverConfig
}

export function configureNeo4jDriver(
  url: any,
  username: any,
  password: any
): neo4j.Driver {
  const driver = neo4j.driver(url, neo4j.auth.basic(username, password))
  return driver;
}
