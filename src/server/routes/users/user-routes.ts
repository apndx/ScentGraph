import * as express from "express"
import * as neo4j from "neo4j-driver"
const bcrypt = require("bcryptjs")
const neode = require("neode")

export function configureUserRoutes(
  app: express.Application,
  driver: neo4j.Driver,
  apiPath: string
): void {
  const USERS_PATH = `${apiPath}/users`

  app.post(
    `${USERS_PATH}/add`,
    async (req: express.Request, res: express.Response) => {

      const instance = new neode.fromEnv()

      instance.model("User", {
        user_id: {
          type: "uuid",
          primary: true
        },
        username: {
          type: "string",
          index: true
        },
        passwordHash: {
          type: "string"
        },
        name: {
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
        createdAt: {
          type: "datetime",
          default: () => new Date()
        }
      })

      try {
        if (req.body.password.length < 8) {
          return res.status(400).json({ error: 'Password must be at least 8 characters long.' })
        }
        const existingUser = await instance.cypher('MATCH (user:User {username:{username}}) return user.username', req.body)
        if (existingUser.records.length > 0) {
          return res.status(400).json({ error: 'Username must be unique.' })
        }

        const saltRounds = 10

        bcrypt
          .hash(req.body.password, saltRounds)

          .then((hash: string) => {
            Promise.all([
              instance.create("User", {
                name: req.body.name,
                username: req.body.username,
                passwordHash: hash
              })
            ])
              .then(([user]) => {
                console.log(`User ${user.properties().name} created`)
                res.send(user.properties().name)
              })
              .catch((e: any) => {
                console.log("Error :(", e, e.details); // eslint-disable-line no-console
              })
              .then(() => instance.close())
          })
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'something went wrong...' })
      }
    }
  )
}
