import * as express from "express"
const neode = require("neode")

export function configureScentRoutes(
  app: express.Application,
  apiPath: string
): void {
  const SCENTS_PATH = `${apiPath}/scents`

  app.post(
    `${SCENTS_PATH}/add`,
    async (req: express.Request, res: express.Response) => {

      const instance = new neode(
        process.env.GRAPHENEDB_BOLT_URL,
        process.env.GRAPHENEDB_BOLT_USER,
        process.env.GRAPHENEDB_BOLT_PASSWORD)

      instance.model("Scent", {
        scent_id: {
          type: "uuid",
          primary: true
        },
        scentname: {
          type: "string",
          index: true
        },
        has: {
          type: "relationship",
          relationship: "HAS",
          direction: "out",
          properties: {
            since: {
              type: "localdatetime",
              default: () => new Date()
            },
            width: {
              type: "number",
              default: 50
            }
          }
        },
        belongs: {
          type: "relationship",
          relationship: "BELONGS",
          direction: "in",
          properties: {
            since: {
              type: "localdatetime",
              default: () => new Date()
            }
          }
        },
        createdAt: {
          type: "datetime",
          default: () => new Date()
        }
      })

      try {
        if (req.body.scentname.length < 1) {
          return res.status(400).json({ error: 'Empty name is not allowed.' })
        }
        const existingScent = await instance.cypher('MATCH (scent:Scent {scentname:{scentname}}) return scent.scentname', req.body)
        if (existingScent.records.length > 0) {
          return res.status(400).json({ error: 'Scentname must be unique.' })
        }

        Promise.all([
          instance.create("Scent", {
            scentname: req.body.scentname
          })
        ])
          .then(([scent]) => {
            console.log(`Scent ${scent.properties().scentname} created`)
            console.log('SCENT', scent)
            res.status(200).send(scent.properties())
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
