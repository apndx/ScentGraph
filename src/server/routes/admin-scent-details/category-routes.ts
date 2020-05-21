import * as express from 'express'
import { checkAdmin, checkLogin } from '../../middleware'
import { category } from '../../models'
import { convertToScentItem } from '../route-helpers'
import { ScentItem } from '../../../common/data-classes'

export function configureCategoryRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/category`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model('Category', category)

      try {

        const existingCategory = await instance.cypher('MATCH (category:Category {categoryname:{itemName}}) return category.categoryname', req.body)
        if (existingCategory.records.length > 0) {
          return res.status(400).json({ error: 'Category must be unique.' })
        }

        Promise.all([
          instance.create('Category', {
            categoryname: req.body.itemName,
            label: req.body.label
          })
        ])
          .then(([category]) => {
            res.status(200).send(`Category ${category.properties().categoryname} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a category' })
      }
    }
  )

  app.get(
    `${ADMIN_DETAILS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      instance.model('Category', category)
      const categories: ScentItem[] = []
      try {
        const result = await instance.cypher('MATCH (category:Category) RETURN category')
          .then((result: any) => {
            result.records.map((row: any) => {
              categories.push(convertToScentItem(row.get('category')))
            })
            console.log(categories)
            res.status(200).send(categories)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching categories' })
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
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a category' })
      }
    }
  )
}
