import { stopServer } from '../../src/server/server'

export default async () => {
    // @ts-ignore
    stopServer(global.__EXPRESS_SERVER__, global.__NEO4J_DREVER__)
}
