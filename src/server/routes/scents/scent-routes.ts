import * as express from "express"
import { checkLogin, authenticateToken } from '../../middleware'
import { scent, brand, timeOfDay, gender, season, category, user } from '../../models'
import { ScentToCreate, GraphNodeOut, GraphEdgeOut } from '../../../common/data-classes'
import { nodeConverter, edgeConverter } from '../route-helpers'

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

      //const notes: string[] = req.body.scentToCreate.notes

      instance.model("Scent", scent)
      instance.model("Brand", brand)
      instance.model("TimeOfDay", timeOfDay)
      instance.model("Gender", gender)
      instance.model("Season", season)
      instance.model("Category", category)
      instance.model("User", user)

      try {
        if (scentToBe.scentname.length < 1) {
          return res.status(400).json({ error: 'Empty name is not allowed.' })
        }
        const existingScent = await instance.cypher(`MATCH (scent:Scent {scentname:{scentname}})
        -[:BELONGS]->(brand:Brand {brandname:{brandname}})
        return scent.scentname`, scentToBe)
        if (existingScent.records.length > 0) {
          console.log('EXISTING', existingScent.records)
          return res.status(400).json({ error: 'Scent must be unique.' })
        }
        // Promise.all([
        //   //   instance.merge("Brand", { brandname: scentToBe.brandname }),
        //   instance.merge("Scent", { scentname: scentToBe.scentname })
        // ])
        //   .then(async ([scent]: any) => {
        await instance.cypher(`
            MATCH (time:TimeOfDay{timename:$timename})
            MERGE (scent:Scent{scentname:$scentname})
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
          // .then(([scent]: any) => {
          .then(() => {
            // console.log(`Scent ${scent.properties().scentname} created`)
            console.log(`Scent created`)
            res.status(200).send(`scent created`)
          })
          // })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong in scent creation: ${e.details}` })
      }
    }
  )

  app.get(
    `${SCENTS_PATH}/allFromCategory/:category`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model("Scent", scent)
      instance.model("Category", category)
      instance.model("Brand", brand)
      instance.model("Season", season)
      instance.model("TimeOfDay", timeOfDay)
      instance.model("Gender", gender)
      console.log('REQS', req.params)
      const params = { categoryname: req.params.category }
      const nodes: GraphNodeOut[] = []
      const edges: GraphEdgeOut[] = []

      try {
        const result = await instance.cypher(`MATCH (scent:Scent)
        -[belcategory:BELONGS]->(category:Category {categoryname:{categoryname}})
        MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
        MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
        MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
        MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
        return scent, category, brand, season, time, gender,
        belcategory, belbrand, belseason, beltime, belgender`, params)
          .then((result: any) => {
            console.log(result.records)
            result.records.map((row: any) => {
              nodes.push(nodeConverter(row.get('scent')))
              nodes.push(nodeConverter(row.get('category')))
              nodes.push(nodeConverter(row.get('brand')))
              nodes.push(nodeConverter(row.get('season')))
              nodes.push(nodeConverter(row.get('time')))
              nodes.push(nodeConverter(row.get('gender')))
              edges.push(edgeConverter(row.get('belcategory')))
              edges.push(edgeConverter(row.get('belbrand')))
              edges.push(edgeConverter(row.get('belseason')))
              edges.push(edgeConverter(row.get('beltime')))
              edges.push(edgeConverter(row.get('belgender')))

              console.log(row.get('belgender'))
            })
            console.log(nodes, edges)
            res.status(200).send({ nodes, edges })
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching scents' })
      }
    }
  )

}
