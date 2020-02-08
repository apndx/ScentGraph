import  { loadServerConfig } from './config'


describe (`server config`, () => {
    it(`should load config`, () => {
        const config = loadServerConfig()

        expect(config).toEqual({
            env: 'test',
            serverPort: 8000,
            publicPath: '../..dist',
            apiUrl: 'http://localhost:5000',
            neo4jUrl: 'bolt://localhost:7687'
        })
    })
})
