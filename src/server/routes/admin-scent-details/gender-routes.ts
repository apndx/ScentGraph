import * as express from 'express'
import { checkAdmin } from '../../middleware'
import { gender } from '../../models'
import { ScentItem } from '../../../common/data-classes'
import { convertToScentItem } from '../route-helpers'

export function configureGenderRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/gender`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      instance.model('Gender', gender)

      try {

        const existingGender = await instance.cypher('MATCH (gender:Gender {gendername:{itemName}}) return gender.gendername', req.body)
        if (existingGender.records.length > 0) {
          return res.status(400).json({ error: 'Gender must be unique.' })
        }

        Promise.all([
          instance.create('Gender', {
            gendername: req.body.itemName
          })
        ])
          .then(([gender]) => {
            res.status(200).send(`Gender ${gender.properties().gendername} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a gender' })
      }
    }
  )

  app.get(
    `${ADMIN_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      instance.model('Gender', gender)
      const genders: ScentItem[] = []
      try {
        const result = await instance.cypher('MATCH (gender:Gender) RETURN gender')
          .then((result: any) => {
            result.records.map((row: any) => {
              genders.push(convertToScentItem(row.get('gender')))
            })
            console.log(genders)
            res.status(200).send(genders)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching genders' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      try {
        await instance.cypher('MATCH (gender:Gender {gendername:{itemName}}) DELETE gender', req.body)
          .then(() => {
            res.status(200).send('Gender deleted')
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a gender' })
      }
    }
  )
}
