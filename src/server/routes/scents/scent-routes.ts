import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import { checkLogin, authenticateToken } from '../../middleware'
import { ScentItem } from '../../../common/data-classes'
import { getScentNameAndBrand } from '../route-helpers'

export function configureScentRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {
  const SCENTS_PATH = `${apiPath}/scents`

  app.post(
    `${SCENTS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()
      const username = authenticateToken(req).username
      const url = req.body.url ? req.body.url : ''

      try {
        if (req.body.scentname.length < 1) {
          return res.status(400).json({ error: 'Empty name is not allowed.' })
        }
        const getScentCypher = `MATCH (scent:Scent {scentname:$scentname})
          -[:BELONGS]->(brand:Brand {brandname:$brandname})
          return scent.scentname`

        const existingScent = await session.run(getScentCypher,
          { scentname: req.body.scentname, brandname: req.body.brandname })

        if (existingScent.records.length > 0) {
          console.log('EXISTING', existingScent.records)
          return res.status(400).json({ error: 'Scent must be unique.' })
        }

        await session.run(`
            CREATE (scent:Scent {
              scentname: $scentname,
              url: $url,
              scent_id: randomUuid()
            })
            SET scent.created_at = datetime()
            RETURN scent
            `,
          {
            scentname: req.body.scentname,
            url: url
          })

        await session.run(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (time:TimeOfDay{timename:$timename})
            MERGE (scent)-[belongs:BELONGS]->(time)-[has:HAS]->(scent)
            RETURN scent`,
            {
              scentname: req.body.scentname,
              timename: req.body.timename
            })

        await session.run(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (gender:Gender{gendername:$gendername})
            MERGE (scent)-[belongs:BELONGS]->(gender)-[has:HAS]->(scent)
            RETURN scent`,
            {
              scentname: req.body.scentname,
              gendername: req.body.gendername,
            })

        await session.run(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (season:Season{seasonname:$seasonname})
            MERGE (scent)-[belongs:BELONGS]->(season)-[has:HAS]->(scent)
            RETURN scent`,
            {
              scentname: req.body.scentname,
              seasonname: req.body.seasonname,
            })

        await session.run(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (category:Category{categoryname:$categoryname})
            MERGE (scent)-[belongs:BELONGS]->(category)-[has:HAS]->(scent)
            RETURN scent`,
            {
              scentname: req.body.scentname,
              categoryname: req.body.categoryname,
            })

        await session.run(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (brand:Brand{brandname:$brandname})
            MERGE (scent)-[belongs:BELONGS]->(brand)-[has:HAS]->(scent)
            RETURN scent`,
            {
              scentname: req.body.scentname,
              brandname: req.body.brandname,
            })

        await session.run(`
            MATCH (scent:Scent{scentname:$scentname})
            MATCH (user:User{username:$username})
            MERGE (user)-[added:ADDED]->(scent)
            RETURN scent`,
            {
              scentname: req.body.scentname,
              username: username,
            })

        .then(() => {
          res.status(200).send(`Scent ${req.body.scentname} created`)
        })
        .catch((e: any) => {
          console.log('Error :(', e) // eslint-disable-line no-console
        })
        .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong in scent creation: ${e.details}` })
      }
    }
  )

  app.get(
    `${SCENTS_PATH}/all`,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()
      const scents: ScentItem[] = []

      try {

        const getScentsCypher = `MATCH (scent:Scent)
        -[belbrand:BELONGS]->(brand:Brand) RETURN scent, brand`

        session.run(getScentsCypher)
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
        .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching scents' })
      }
    }
  )

}
