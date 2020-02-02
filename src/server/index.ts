import { loadServerConfig, configureNeo4jDriver } from "./config"
import { startServer, stopServer } from "./server"
import * as dotenv from 'dotenv'

const config = loadServerConfig()

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const neo4jUser = process.env.NEO4J_USERNAME
const neo4jPass = process.env.NEO4J_PASSWORD
const driver = configureNeo4jDriver(config.neo4jUrl, neo4jUser, neo4jPass)

const server = startServer(config, driver)
server.then(instance => {
  process.on("SIGINT", async () => {
    stopServer(instance, driver)
  })
})
