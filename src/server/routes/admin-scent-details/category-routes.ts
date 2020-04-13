import * as express from "express"
import { checkAdmin } from '../../middleware'
import { category } from '../../models'

export function configureCategoryRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/category`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      instance.model("Category", category)

      try {

        const existingCategory = await instance.cypher('MATCH (category:Category {categoryname:{itemName}}) return category.categoryname', req.body)
        if (existingCategory.records.length > 0) {
          return res.status(400).json({ error: 'Category must be unique.' })
        }

        Promise.all([
          instance.create("Category", {
            categoryname: req.body.itemName,
            label: req.body.label
          })
        ])
          .then(([category]) => {
            console.log(`Category ${category.properties().categoryname} created`)
            res.status(200).send(category.properties().categoryname)
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a category' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`, checkAdmin,
    async (req: express.Request, res: express.Response) => {

      try {
        await instance.cypher('MATCH (category:Category {categoryname:{itemName}}) DELETE category', req.body)
          .then(() => {
            res.status(200).send('Category deleted')
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a category' })
      }
    }
  )
}
