import * as express from "express"
const neode = require("neode")

export function configureSeasonRoutes(
  app: express.Application,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/season`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`,
    async (req: express.Request, res: express.Response) => {

      const instance = new neode(
        process.env.GRAPHENEDB_BOLT_URL,
        process.env.GRAPHENEDB_BOLT_USER,
        process.env.GRAPHENEDB_BOLT_PASSWORD)

      instance.model("Season", {
        time_id: {
          type: "uuid",
          primary: true
        },
        seasonname: {
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
            },
            width: {
              type: "number",
              default: 50
            }
          }
        },
        createdAt: {
          type: "datetime",
          default: () => new Date()
        }
      })

      try {
        Promise.all([
          instance.create("Season", {
            seasonname: req.body.seasonname
          })
        ])
          .then(([season]) => {
            console.log(`Season ${season.properties().seasonname} created`)
            res.status(200).send(season.properties())
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a season' })
      }
    }
  )

  app.delete(
    `${ADMIN_DETAILS_PATH}/delete`,
    async (req: express.Request, res: express.Response) => {

      const instance = new neode(
        process.env.GRAPHENEDB_BOLT_URL,
        process.env.GRAPHENEDB_BOLT_USER,
        process.env.GRAPHENEDB_BOLT_PASSWORD)

      try {
        await instance.cypher('MATCH (season:Season {seasonname:{seasonname}}) DELETE season', req.body)
          .then(() => {
            res.status(200).send('Season deleted')
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a season' })
      }
    }
  )

}
