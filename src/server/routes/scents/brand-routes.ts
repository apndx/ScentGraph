import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { checkLogin } from '../../middleware'
import { convertToScentItem } from '../../routes'
import { ScentItem } from '../../../common/data-classes'

export function configureBrandRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {
  const SCENT_DETAILS_PATH = `${apiPath}/brand`

  app.post(
    `${SCENT_DETAILS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      try {

        const getBrandCypher = 'MATCH (brand:Brand {brandname:$itemName}) return brand.brandname'
        const existingBrand = await session.run(getBrandCypher, { itemName: req.body.itemName })

        if (existingBrand.records.length > 0) {
          return res.status(400).json({ error: 'Brand must be unique.' })
        }

        Promise.all([
          session.run(`
          CREATE (brand:Brand {
            brandname: $brandName
          })
          RETURN brand
          `,
          { brandName: req.body.itemName }
        )
        ])
          .then(() => {
            res.status(200).send(`Brand ${req.body.itemName} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a brand' })
      }
    }
  )

  app.get(
    `${SCENT_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()
      const brands: ScentItem[] = []
      try {
        const getBrandsCypher = 'MATCH (brand:Brand) RETURN brand'
        session.run(getBrandsCypher)
          .then((result: any) => {
            result.records.map((row: any) => {
              brands.push(convertToScentItem(row.get('brand')))
            })
            console.log(brands)
            res.status(200).send(brands)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching brands' })
      }
    }
  )
}
