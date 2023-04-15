import * as express from 'express'
const pjson = require('../../../../package.json')

export function configureMonitoringRoutes(
  app: express.Application,
  apiPath: string
): void {
  const HEALTH_PATH = `${apiPath}/health`
  const VERSION_PATH = `${apiPath}/version`
  app.get(
    HEALTH_PATH,
    async (req: express.Request, res: express.Response) => {
      res.send('ok')
    }
  )

  app.get(
    VERSION_PATH,
    async (req: express.Request, res: express.Response) => {
    res.send(pjson.version) // change this string to ensure a new version deployed
  })
}
