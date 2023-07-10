import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import {
  GraphNodeOut,
  GraphEdgeOut,
  GraphNodeIn,
  GraphEdgeIn,
} from '../../../common/data-classes'
import {
  nodeConverter,
  edgeConverter,
  isUniqueNode,
  isUniqueEdge,
  cypherDecider,
  paramDecider
} from '../route-helpers'

export function configureGraphRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {

  const GRAPH_PATH = `${apiPath}/graph`

  app.post(
    `${GRAPH_PATH}/allFrom`,
    async (req: express.Request, res: express.Response) => {

      const session = driver.session()

      const cypher: string = cypherDecider(req.body)
      const params = paramDecider(req.body)
      const nodes: GraphNodeOut[] = []
      const edges: GraphEdgeOut[] = []

      try {

        session.run(cypher, params)
          .then((result: any) => {

            const records = req.body.type === 'current' ? [result.records[Math.floor(Math.random() * result.records.length)]] : result.records
            records.map((row: any) => {

              const scent: GraphNodeIn = row.get('scent') || null
              const category: GraphNodeIn = row.get('category') || null
              const brand: GraphNodeIn = row.get('brand') || null
              const season: GraphNodeIn = row.get('season') || null
              const time: GraphNodeIn = row.get('time') || null
              const gender: GraphNodeIn = row.get('gender') || null
              const note: GraphNodeIn = req.body.type === 'note' ? row.get('note') : null
              const user: GraphNodeIn = row.get('user') || null

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
              if (isUniqueNode(nodes, note)) {
                nodes.push(nodeConverter(note))
              }
              if (isUniqueNode(nodes, user)) {
                nodes.push(nodeConverter(user))
              }

              const belongsToCategory: GraphEdgeIn = row.get('belcategory') || null
              const belongsToBrand: GraphEdgeIn = row.get('belbrand') || null
              const belongsToSeason: GraphEdgeIn = row.get('belseason') || null
              const belongsToTime: GraphEdgeIn = row.get('beltime') || null
              const belongsToGender: GraphEdgeIn = row.get('belgender') || null
              const hasNote: GraphEdgeIn = req.body.type === 'note' ? row.get('hasnote') : null
              const addedBy: GraphEdgeIn = row.get('addedby') || null

              if (isUniqueEdge(edges, belongsToCategory)) {
                edges.push(edgeConverter(belongsToCategory))
              }
              if (isUniqueEdge(edges, belongsToBrand)) {
                edges.push(edgeConverter(belongsToBrand))
              }
              if (isUniqueEdge(edges, belongsToSeason)) {
                edges.push(edgeConverter(belongsToSeason))
              }
              if (isUniqueEdge(edges, belongsToTime)) {
                edges.push(edgeConverter(belongsToTime))
              }
              if (isUniqueEdge(edges, belongsToGender)) {
                edges.push(edgeConverter(belongsToGender))
              }
              if (isUniqueEdge(edges, hasNote)) {
                edges.push(edgeConverter(hasNote))
              }
              if (isUniqueEdge(edges, addedBy)) {
                edges.push(edgeConverter(addedBy))
              }
            })
            res.status(200).send({ nodes, edges })
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

  app.post(
    `${GRAPH_PATH}/scentNotesForGraph`,
    async (req: express.Request, res: express.Response) => {

      const params = { scentname: req.body.scentname }

      const nodes: GraphNodeOut[] = []
      const edges: GraphEdgeOut[] = []

      const session = driver.session()

      try {
        session.run(
          `MATCH (scent:Scent {scentname:$scentname})-[has:HAS]->(note:Note)
              return note, has`, params)
          .then((result: any) => {
            result.records.map((row: any) => {

              const note: GraphNodeIn = row.get('note') || null
              if (isUniqueNode(nodes, note)) {
                nodes.push(nodeConverter(note))
              }

              const has: GraphEdgeIn = row.get('has') || null
              if (isUniqueEdge(edges, has)) {
                edges.push(edgeConverter(has))
              }

            })
            res.status(200).send({ nodes, edges })
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => session.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching notes' })
      }
    }
  )

}
