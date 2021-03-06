import * as express from 'express'
import { checkAdmin } from '../../middleware'
import { timeOfDay } from '../../models'
import { ScentItem } from '../../../common/data-classes'
import { convertToScentItem } from '../route-helpers'

export function configureTimeOfDayRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/time`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      instance.model('TimeOfDay', timeOfDay)

      try {
        const existingTime = await instance.cypher('MATCH (time:TimeOfDay {timename:{itemName}}) return time.timename', req.body)
        if (existingTime.records.length > 0) {
          return res.status(400).json({ error: 'Time of day must be unique.' })
        }
        Promise.all([
          instance.create('TimeOfDay', {
            timename: req.body.itemName
          })
        ])
          .then(([time]) => {
            res.status(200).send(`Time of day ${time.properties().timename} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a time of day' })
      }
    }
  )

  app.get(
    `${ADMIN_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      instance.model('TimeOfDay', timeOfDay)
      const times: ScentItem[] = []
      try {
        await instance.cypher('MATCH (time:TimeOfDay) RETURN time')
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
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching times of day' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      try {
        await instance.cypher('MATCH (time:TimeOfDay {timename:{itemName}}) DELETE time', req.body)
          .then(() => {
            res.status(200).send('Time of day deleted')
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a time of day' })
      }
    }
  )
}
