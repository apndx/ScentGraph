import * as express from "express"
const neode = require("neode")

export function configureTimeOfDayRoutes(
  app: express.Application,
  apiPath: string
): void {
  const ADMIN_DETAILS_PATH = `${apiPath}/time`

  app.post(
    `${ADMIN_DETAILS_PATH}/add`,
    async (req: express.Request, res: express.Response) => {

      const instance = new neode(
        process.env.GRAPHENEDB_BOLT_URL,
        process.env.GRAPHENEDB_BOLT_USER,
        process.env.GRAPHENEDB_BOLT_PASSWORD)

      instance.model("TimeOfDay", {
        time_id: {
          type: "uuid",
          primary: true
        },
        timename: {
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
          instance.create("TimeOfDay", {
            timename: req.body.timename
          })
        ])
          .then(([time]) => {
            console.log(`Time of day ${time.properties().timename} created`)
            res.status(200).send(time.properties())
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in creating a time of day' })
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
        await instance.cypher('MATCH (time:TimeOfDay {timename:{timename}}) DELETE time', req.body)
          .then(() => {
            res.status(200).send('Time of day deleted')
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a time of day' })
      }
    }
  )
}
