import { loadServerConfig } from '../../src/server/config'
import { startServer } from '../../src/server/server'
import { configureNeo4jDriver } from '../../src/server/config'
require('dotenv').config()

export default async () => {

    const envParams = {
        PORT: '8000',
        NEO4J_URL: process.env.AURA_BOLT_URL || 'bolt://localhost:7687',
        API_URL: 'http://localhost:5000',
    }
    process.env = {...process.env, ...envParams}
    const config = loadServerConfig()
    // @ts-ignore
    global.__APP_CONFIG__ = config

    const neoDriver = configureNeo4jDriver(process.env.AURA_BOLT_URL, process.env.AURA_USER, process.env.AURA_PASSWORD)
    // @ts-ignore
    global.__NEO4J_DRIVER__ = neoDriver
    // @ts-ignore
    global.__EXPRESS_SERVER__ = await startServer(config, neoDriver)
}
