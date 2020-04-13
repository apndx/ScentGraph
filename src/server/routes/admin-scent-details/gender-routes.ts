import * as express from "express"
import { checkAdmin } from '../../middleware'
import { gender } from '../../models'

export function configureGenderRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/gender`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      instance.model("Gender", gender)

      try {
        Promise.all([
          instance.create("Gender", {
            gendername: req.body.itemName
          })
        ])
          .then(([gender]) => {
            console.log(`Gender ${gender.properties().gendername} created`)
            res.status(200).send(gender.properties().gendername)
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a gender' })
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
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a gender' })
      }
    }
  )
}
