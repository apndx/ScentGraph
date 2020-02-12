import * as express from 'express'
import * as path from 'path'
import { ServerConfig } from '../config'

export function configureRouteNotFoundMiddleware(
    config: ServerConfig,
    app: express.Application,
    apiPath: string
): void {
    app.use(`${apiPath}/*`, (req: express.Request, res: express.Response) => {
        res.sendStatus(404)
    })

    app.get(`*`, (req: express.Request, res: express.Response) => {
        if (process.env.NODE_ENV === 'test') {
            res.send(`<!DOCTYPE html><html>`)
        } else {
            const publicFilesPath = path.join(__dirname, `..`, config.publicPath)
            res.sendFile(`${publicFilesPath}/index.html`)
        }
    })
}
