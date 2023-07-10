import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { checkAdmin, checkLogin } from '../../middleware'
import { convertToScentItem } from '../route-helpers'
import { ScentItem } from '../../../common/data-classes'

export function configureCategoryRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/category`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      try {

        const getCategoryCypher = 'MATCH (category:Category {categoryname:$itemName}) return category.categoryname'
        const existingCategory = await session.run(getCategoryCypher, { itemName: req.body.itemName })

        if (existingCategory.records.length > 0) {
          return res.status(400).json({ error: 'Category must be unique.' })
        }

        Promise.all([
          session.run(`
            CREATE (category:Category {
              category_id: randomUuid(),
              categoryname: $categoryName,
              label: $label
            })
            SET category.created_at = datetime()
            RETURN category
            `,
            { categoryName: req.body.itemName,
              label: req.body.label }
          )
        ])
          .then(() => {
            res.status(200).send(`Category ${req.body.itemName} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a category' })
      }
    }
  )

  app.get(
    `${ADMIN_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      const categories: ScentItem[] = []

      try {
        const getCategoriesCypher = 'MATCH (category:Category) RETURN category'
        session.run(getCategoriesCypher)
          .then((result: neo4j.QueryResult) => {
            result.records.map((row: any) => {
              categories.push(convertToScentItem(row.get('category')))
            })
            res.status(200).send(categories)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching categories' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      try {
        const deleteCategoryCypher = 'MATCH (category:Category {categoryname:$itemName}) DELETE category'
        await session.run(deleteCategoryCypher, { itemName : req.body.itemName })
          .then(() => {
            res.status(200).send('Category deleted')
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a category' })
      }
    }
  )
}
