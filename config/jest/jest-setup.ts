import { loadServerConfig } from '../../src/server/config'
import { startServer } from '../../src/server/server'
import { configureNeo4jDriver } from '../../src/server/config'

export default async () => {
    
    const envParams = {
        SERVER_PORT: '8000',
        NEO4J_URS: 'bolt://localhost:7687',
        API_URL: 'http://localhost:5000'
    }
    process.env = {...process.env, ...envParams}
    const config = loadServerConfig()
    // @ts-ignore
    global.__APP_CONFIG__ = config

    const neoDriver = configureNeo4jDriver(config.neo4jUrl, process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    // @ts-ignore
    global.__NEO4J_DREVER__ = neoDriver
    // @ts-ignore
    global.__EXPRESS_SERVER__ = await startServer(config, neoDriver)
}