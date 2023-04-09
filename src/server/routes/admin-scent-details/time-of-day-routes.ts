import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { checkAdmin } from '../../middleware'
import { ScentItem } from '../../../common/data-classes'
import { convertToScentItem } from '../route-helpers'

export function configureTimeOfDayRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/time`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      try {

        const getTimeCypher = 'MATCH (time:TimeOfDay {timename:$itemName}) return time.timename'
        const existingTime= await session.run(getTimeCypher, { itemName: req.body.itemName })

        if (existingTime.records.length > 0) {
          return res.status(400).json({ error: 'Time of day must be unique.' })
        }
        Promise.all([
            session.run(`
          CREATE (time:TimeOfDay {
            timename: $timeName
          })
          RETURN time
          `,
          { timeName: req.body.itemName }
        )
        ])
          .then(([time]) => {
            res.status(200).send(`Time of day ${req.body.itemName} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a time of day' })
      }
    }
  )

  app.get(
    `${ADMIN_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()
      const times: ScentItem[] = []
      try {
        const getTimesCypher = 'MATCH (time:TimeOfDay) RETURN time'
        session.run(getTimesCypher )
          .then((result: any) => {
            result.records.map((row: any) => {
              times.push(convertToScentItem(row.get('time')))
            })
            console.log(times)
            res.status(200).send(times)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching times of day' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`, checkAdmin,
    async (req: express.Request, res: express.Response) => {
      const session = driver.session()
      try {
        const deleteTimeCypher = 'MATCH (time:TimeOfDay {timename:$itemName}) DELETE time'
        session.run(deleteTimeCypher, req.body.itemName)
          .then(() => {
            res.status(200).send('Time of day deleted')
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a time of day' })
      }
    }
  )
}
