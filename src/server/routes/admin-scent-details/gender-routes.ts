import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { checkAdmin } from '../../middleware'
import { ScentItem } from '../../../common/data-classes'
import { convertToScentItem } from '../route-helpers'

export function configureGenderRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/gender`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      try {

        const getGenderCypher = 'MATCH (gender:Gender {gendername:$itemName}) return gender.gendername'
        const existingGender = await session.run(getGenderCypher, { itemName: req.body.itemName })

        if (existingGender.records.length > 0) {
          return res.status(400).json({ error: 'Gender must be unique.' })
        }

        Promise.all([
          session.run(`
            CREATE (gender:Gender {
              gendername: $genderName,
              label: $label
            })
            RETURN gender
            `,
            { genderName: req.body.itemName,
              label: req.body.label }
          )
        ])
          .then(() => {
            res.status(200).send(`Gender ${req.body.itemName} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a gender' })
      }
    }
  )

  app.get(
    `${ADMIN_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()
      const genders: ScentItem[] = []
      try {
        const getGendersCypher = 'MATCH (gender:Gender) RETURN gender'
        session.run(getGendersCypher)
          .then((result: neo4j.QueryResult) => {
            result.records.map((row: any) => {
              genders.push(convertToScentItem(row.get('gender')))
            })
            console.log(genders)
            res.status(200).send(genders)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching genders' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`, checkAdmin,
    async (req: express.Request, res: express.Response) => {
      const session = driver.session()
      try {
        session.run('MATCH (gender:Gender {gendername:$itemName}) DELETE gender', req.body.itemName)
          .then(() => {
            res.status(200).send('Gender deleted')
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a gender' })
      }
    }
  )
}
