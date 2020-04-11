import * as express from "express"
import { checkLogin } from '../../middleware'
import { scent, brand } from '../../models'
import { ScentToCreate } from '../../../common/data-classes'

export function configureScentRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const SCENTS_PATH = `${apiPath}/scents`

  app.post(
    `${SCENTS_PATH}/add`, checkLogin,
    async (req: express.Request, res: express.Response) => {

      const scentToBe: ScentToCreate = req.body.scentToCreate
      //const notes: string[] = req.body.scentToCreate.notes

      instance.model("Scent", scent)
      instance.model("Brand", brand)

      try {
        if (req.body.scentToCreate.scentname.length < 1) {
          return res.status(400).json({ error: 'Empty name is not allowed.' })
        }
        const existingScent = await instance.cypher(`MATCH (scent:Scent {scentname:{scentname}})
        -[:BELONGS]->(brand:Brand {brandname:{brandname}})
        return scent.scentname`, scentToBe)
        if (existingScent.records.length > 0) {
          console.log('EXISTING', existingScent.records)
          return res.status(400).json({ error: 'Scent must be unique.' })
        }
        Promise.all([
          instance.merge("Brand", { brandname: scentToBe.brandname }),
          instance.merge("Scent", { scentname: scentToBe.scentname })
        ])
          .then(async ([scent]: any) => {
            await instance.cypher(`MATCH (scent:Scent),(brand:Brand)
          WHERE scent.scentname = $scentname AND brand.brandname = $brandname
          MERGE (scent)-[belongs:BELONGS]->(brand)-[has:HAS]->(scent)
          RETURN type(belongs), type(has), scent`, scentToBe)
              //  })
              //  .then(([scent]: any) => {
              .then(() => {
                // console.log(`Scent ${scent.properties().scentname} created`)
                console.log(`Scent created`)
                res.status(200).send('scent created')
              })
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in scent creation' })
      }
    }
  )
}
