import * as express from 'express'
import { checkLogin, authenticateToken } from '../../middleware'
import { scent, brand, timeOfDay, gender, season, category, user } from '../../models'
import { ScentToCreate, ScentItem } from '../../../common/data-classes'
import { getScentNameAndBrand } from '../route-helpers'

export function configureScentRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const SCENTS_PATH = `${apiPath}/scents`

  app.post(
    `${SCENTS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const username = authenticateToken(req).username

      const scentToBe: ScentToCreate = {
        ...req.body,
        username
      }

      instance.model('Scent', scent)
      instance.model('Brand', brand)
      instance.model('TimeOfDay', timeOfDay)
      instance.model('Gender', gender)
      instance.model('Season', season)
      instance.model('Category', category)
      instance.model('User', user)

      try {
        if (scentToBe.scentname.length < 1) {
          return res.status(400).json({ error: 'Empty name is not allowed.' })
        }
        const existingScent = await instance.cypher(`MATCH (scent:Scent {scentname:$scentname})
        -[:BELONGS]->(brand:Brand {brandname:$brandname})
        return scent.scentname`, scentToBe)
        if (existingScent.records.length > 0) {
          console.log('EXISTING', existingScent.records)
          return res.status(400).json({ error: 'Scent must be unique.' })
        }
        await instance.create('Scent', {
          scentname: req.body.scentname
        })
        await instance.cypher(`
            MATCH (time:TimeOfDay{timename:$timename})
            MATCH (scent:Scent{scentname:$scentname})
            MERGE (scent)-[belongs:BELONGS]->(time)-[has:HAS]->(scent)
            RETURN type(belongs), type(has), scent`, scentToBe)
        await instance.cypher(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (gender:Gender{gendername:$gendername})
            MERGE (scent)-[belongs:BELONGS]->(gender)-[has:HAS]->(scent)
            RETURN type(belongs), type(has), scent`, scentToBe)
        await instance.cypher(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (season:Season{seasonname:$seasonname})
            MERGE (scent)-[belongs:BELONGS]->(season)-[has:HAS]->(scent)
            RETURN type(belongs), type(has), scent`, scentToBe)
        await instance.cypher(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (category:Category{categoryname:$categoryname})
            MERGE (scent)-[belongs:BELONGS]->(category)-[has:HAS]->(scent)
            RETURN type(belongs), type(has), scent`, scentToBe)
        await instance.cypher(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (brand:Brand{brandname:$brandname})
            MERGE (scent)-[belongs:BELONGS]->(brand)-[has:HAS]->(scent)
            RETURN type(belongs), type(has), scent`, scentToBe)
        await instance.cypher(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (user:User{username:$username})
            MERGE (user)-[added:ADDED]->(scent)
            RETURN type(added), scent`, scentToBe)
          .then(() => {
            res.status(200).send(`Scent ${scentToBe.scentname} created`)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong in scent creation: ${e.details}` })
      }
    }
  )

  app.get(
    `${SCENTS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      instance.model('Scent', scent)
      instance.model('Brand', brand)
      const scents: ScentItem[] = []
      try {
        await instance.cypher(`MATCH (scent:Scent)
          -[belbrand:BELONGS]->(brand:Brand) RETURN scent, brand`)
          .then((result: any) => {
            result.records.map((row: any) => {
              scents.push(getScentNameAndBrand(row.get('scent'), row.get('brand')))
            })
            console.log(scents)
            res.status(200).send(scents)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching scents' })
      }
    }
  )

}
