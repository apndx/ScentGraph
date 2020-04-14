import * as express from "express"
import { checkLogin } from '../../middleware'
import { brand } from '../../models'
import { getName } from '../../routes'

export function configureBrandRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const SCENT_DETAILS_PATH = `${apiPath}/brand`

  app.post(
    `${SCENT_DETAILS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model("Brand", brand)

      try {
        Promise.all([
          instance.create("Brand", {
            brandname: req.body.itemName
          })
        ])
          .then(([brand]) => {
            console.log(`Brand ${brand.properties().brandname} created`)
            res.status(200).send(brand.properties().brandname)
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a brand' })
      }
    }
  )


  app.get(
    `${SCENT_DETAILS_PATH}/all`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model('Brand', brand)
      const brands: string[] = []
      try {
        const result = await instance.cypher('MATCH (brand:Brand) RETURN brand')
          .then((result: any) => {
            result.records.map((row: any) => {
              brands.push(getName(row.get('brand')))
            })
            console.log(brands)
            res.status(200).send(brands)
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching brands' })
      }
    }
  )
}