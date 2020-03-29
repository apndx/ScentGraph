import * as express from "express"
const bcrypt = require("bcryptjs")

export function configureUserRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const USERS_PATH = `${apiPath}/users`

  app.post(
    `${USERS_PATH}/add`,
    async (req: express.Request, res: express.Response) => {

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
        role: {
          type: "string",
          default: "user"
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
          }
        },
        likes: {
          type: "relationship",
          relationship: "LIKES",
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
            },
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

  app.delete(
    `${USERS_PATH}/delete`,
    async (req: express.Request, res: express.Response) => {

      try {
        await instance.cypher('MATCH (user:User {username:{username}}) DELETE user', req.body)
          .then(() => {
            res.status(200).send('User deleted')
          })
          .catch((e: any) => {
            console.log("Error :(", e, e.details); // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a user' })
      }
    }
  )

  app.put(
    `${USERS_PATH}/role`,
    async (req: express.Request, res: express.Response) => {
      try {
        const existingUser = await instance.cypher('MATCH (user:User {username:{username}}) return user.username', req.body)
        if (existingUser.records.length < 1) {
          return res.status(400).json({ error: 'User not found' })
        } else {
          await instance.cypher(
            `MERGE (user:User {username:{username}})
            ON MATCH SET user.role = user.role
            return user.username`, req.body)
            .then(() => {
              res.status(200).send(`User ${req.body.username} is now ${req.body.role}`)
            })
        }
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in changing user role' })
      }
    }
  )

}
