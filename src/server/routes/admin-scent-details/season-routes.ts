import * as express from "express"
import { checkAdmin } from '../../middleware'
import { season } from '../../models'

export function configureSeasonRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/season`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      instance.model("Season", season)

      try {
        const existingSeason = await instance.cypher('MATCH (season:Season {seasonname:{itemName}}) return season.seasonname', req.body)
        if (existingSeason.records.length > 0) {
          return res.status(400).json({ error: 'Season must be unique.' })
        }
        Promise.all([
          instance.create("Season", {
            seasonname: req.body.itemName
          })
        ])
          .then(([season]) => {
            console.log(`Season ${season.properties().seasonname} created`)
            res.status(200).send(season.properties().seasonname)
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a season' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      try {
        await instance.cypher('MATCH (season:Season {seasonname:{itemName}}) DELETE season', req.body)
          .then(() => {
            res.status(200).send('Season deleted')
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a season' })
      }
    }
  )
}
