import * as express from "express"
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const neode = require("neode")

export function configureLoginRoutes(
  app: express.Application,
  apiPath: string
): void {
  const LOGIN_PATH = `${apiPath}/login`
console.log('LOGIN PATH', LOGIN_PATH )
  app.post(
    LOGIN_PATH,
    async (req: express.Request, res: express.Response) => {
      console.log('LOGIN')
      const body = req.body
      const instance = new neode(
        process.env.GRAPHENEDB_BOLT_URL,
        process.env.GRAPHENEDB_BOLT_USER,
        process.env.GRAPHENEDB_BOLT_PASSWORD)

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

        const result = await instance.cypher('MATCH (user:User {username:{username}}) return user', req.body)
        const loginUser = result.records[0].get('user')
        
        const passwordCorrect = loginUser === null ? false :
          await bcrypt.compare(body.password, loginUser.properties.passwordHash)

        if (!(loginUser && passwordCorrect)) {
          return res.status(401).json({ error: 'invalid username or password' })
        }

        const username = loginUser.properties.username
        const id = loginUser.properties.user_id
        const name = loginUser.properties.name
        const userForToken = { username, id }
        const token = jwt.sign(userForToken, process.env.SECRET)
        res.status(200).send({ token, username, name })

      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'something went wrong...' })
      }
    }
  )
}
