import  { loadServerConfig } from './config'


describe (`server config`, () => {
    it(`should load config`, () => {
        const config = loadServerConfig()
        const neo4jUrl = process.env.AURA_BOLT_URL || 'bolt://localhost:7687'
        const env = process.env.NODE_ENV || 'test-local'

        expect(config).toEqual({
            env: env,
            serverPort: 8000,
            publicPath: '../../dist',
            apiUrl: 'http://localhost:5000',
            neo4jUrl: neo4jUrl
        })
    })
})
