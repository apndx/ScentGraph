import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { checkAdmin } from '../../middleware'
import { ScentItem } from '../../../common/data-classes'
import { convertToScentItem } from '../route-helpers'

export function configureSeasonRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/season`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      try {
        const getSeasonCypher = 'MATCH (season:Season {seasonname:$itemName}) return season.seasonname'
        const existingSeason = await session.run(getSeasonCypher, { itemName: req.body.itemName })
        if (existingSeason.records.length > 0) {
          return res.status(400).json({ error: 'Season must be unique.' })
        }
        Promise.all([
          session.run(`
          CREATE (season:Season {
            seasonname: $seasonName,
            label: $label
          })
          RETURN season
          `,
          { seasonName: req.body.itemName,
            label: req.body.label }
        )
        ])
          .then(([season]) => {
            console.log(`Season ${season.properties().seasonname} created`)
            res.status(200).send(`Season ${req.body.itemName} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a season' })
      }
    }
  )

  app.get(
    `${ADMIN_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()
      const seasons: ScentItem[] = []
      try {
        const getSeasonsCypher = 'MATCH (season:Season) RETURN season'
        session.run(getSeasonsCypher)
          .then((result: any) => {
            result.records.map((row: any) => {
              seasons.push(convertToScentItem(row.get('season')))
            })
            res.status(200).send(seasons)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching seasons' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`, checkAdmin,
    async (req: express.Request, res: express.Response) => {
      const session = driver.session()
      try {
        const deleteSeasonCypher = 'MATCH (season:Season {seasonname:$itemName}) DELETE season'
        session.run(deleteSeasonCypher, req.body.itemName)
          .then(() => {
            res.status(200).send('Season deleted')
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a season' })
      }
    }
  )
}
