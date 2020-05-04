import { loadServerConfig, configureNeo4jDriver, configureNeode } from "./config"
import { startServer, stopServer } from "./server"
import * as dotenv from 'dotenv'

const config = loadServerConfig()

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const neo4jUser = process.env.NEO4J_USERNAME
const neo4jPass = process.env.NEO4J_PASSWORD
const driver = configureNeo4jDriver(config.neo4jUrl, neo4jUser, neo4jPass)

const neodeUrl = process.env.GRAPHENEDB_BOLT_URL
const neodeUser = process.env.GRAPHENEDB_BOLT_USER
const neodePass =process.env.GRAPHENEDB_BOLT_PASSWORD
const neodeInstance = configureNeode(neodeUrl, neodeUser, neodePass)

const server = startServer(config, driver, neodeInstance)
server.then(instance => {
  process.on("SIGINT", async () => {
    stopServer(instance, driver, neodeInstance)
  })
})
