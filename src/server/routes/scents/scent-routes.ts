import * as express from "express"
import { checkLogin, authenticateToken } from '../../middleware'
import { scent, brand, timeOfDay, gender, season, category, user, note } from '../../models'
import {
  ScentToCreate,
  GraphNodeOut,
  GraphEdgeOut,
  GraphNodeIn,
  GraphEdgeIn,
  ScentItem
} from '../../../common/data-classes'
import {
  nodeConverter,
  edgeConverter,
  isUniqueNode,
  isNotNull,
  getScentFromCypher,
  paramsForScentGraph,
  getScentNameAndBrand
} from '../route-helpers'

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
          .then(() => {
            res.status(200).send(`Scent ${scentToBe.scentname} created`)
          })
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
    `${SCENTS_PATH}/all`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model('Scent', scent)
      instance.model("Brand", brand)
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
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching scents' })
      }
    }
  )

  app.post(
    `${SCENTS_PATH}/allFrom`,
    async (req: express.Request, res: express.Response) => {

      instance.model("Scent", scent)
      instance.model("Category", category)
      instance.model("Brand", brand)
      instance.model("Season", season)
      instance.model("TimeOfDay", timeOfDay)
      instance.model("Gender", gender)
      console.log('REQS', req.body)
      const cypher: string = getScentFromCypher(req.body)
      const params = paramsForScentGraph(req.body)

      const nodes: GraphNodeOut[] = []
      const edges: GraphEdgeOut[] = []

      try {
        await instance.cypher(cypher, params)
          .then((result: any) => {
            console.log(result.records)
            result.records.map((row: any) => {

              const scent: GraphNodeIn = row.get('scent') || null
              const category: GraphNodeIn = row.get('category') || null
              const brand: GraphNodeIn = row.get('brand') || null
              const season: GraphNodeIn = row.get('season') || null
              const time: GraphNodeIn = row.get('time') || null
              const gender: GraphNodeIn = row.get('gender') || null

              if (isUniqueNode(nodes, scent)) {
                nodes.push(nodeConverter(scent))
              }
              if (isUniqueNode(nodes, category)) {
                nodes.push(nodeConverter(category))
              }
              if (isUniqueNode(nodes, brand)) {
                nodes.push(nodeConverter(brand))
              }
              if (isUniqueNode(nodes, season)) {
                nodes.push(nodeConverter(season))
              }
              if (isUniqueNode(nodes, time)) {
                nodes.push(nodeConverter(time))
              }
              if (isUniqueNode(nodes, gender)) {
                nodes.push(nodeConverter(gender))
              }

              const belongsToCategory: GraphEdgeIn = row.get('belcategory') || null
              const belongsToBrand: GraphEdgeIn = row.get('belbrand') || null
              const belongsToSeason: GraphEdgeIn = row.get('belseason') || null
              const belongsToTime: GraphEdgeIn = row.get('beltime') || null
              const belongsToGender: GraphEdgeIn = row.get('belgender') || null

              if (isNotNull(belongsToCategory)) {
                edges.push(edgeConverter(belongsToCategory))
              }
              if (isNotNull(belongsToBrand)) {
                edges.push(edgeConverter(belongsToBrand))
              }
              if (isNotNull(belongsToSeason)) {
                edges.push(edgeConverter(belongsToSeason))
              }
              if (isNotNull(belongsToTime)) {
                edges.push(edgeConverter(belongsToTime))
              }
              if (isNotNull(belongsToGender)) {
                edges.push(edgeConverter(belongsToGender))
              }
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

  app.post(
    `${SCENTS_PATH}/addNote`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      instance.model("Scent", scent)
      instance.model("Brand", brand)
      instance.model("Note", note)

      try {
        const params = { scentname: req.body.name, brandname: req.body.brand, notename: req.body.note }
        const scentHasNoteAlready = await instance.cypher(`MATCH (scent:Scent {scentname:{scentname}})
        -[:BELONGS]->(brand:Brand {brandname:{brandname}})
        MATCH (note:Note {notename:{notename}})-[:BELONGS]->(scent)
        return scent, brand, note`, params)
        if (scentHasNoteAlready.records.length > 0) {
          console.log('EXISTING', scentHasNoteAlready.records)
          return res.status(400).json({ error: 'Scent already has this note.' })
        }
        await instance.cypher(`
        MATCH (scent:Scent {scentname:{scentname}})-[belbrand:BELONGS]->(brand:Brand {brandname:{brandname}})
        MATCH (note:Note{notename:$notename})
        MERGE (note)-[belongs:BELONGS]->(scent)-[has:HAS]->(note)
        RETURN type(belongs), type(has), scent, note`, params)
          .then(() => {
            console.log(`Note added to scent`)
            res.status(200).send(`Note added to scent`)
          })
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: `Something went wrong when adding note to a scent ${e}` })
      }
    }
  )

}
