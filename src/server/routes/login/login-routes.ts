import * as express from 'express'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
import { Token, ClientUser } from '../../../common/data-classes'

export function configureLoginRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const LOGIN_PATH = `${apiPath}/login`
  app.post(
    LOGIN_PATH,
    async (req: express.Request, res: express.Response) => {

      const body = req.body

      try {
        const result = await instance.cypher('MATCH (user:User {username:$username}) return user', req.body)
        console.log(result)
        const loginUser = result.records[0].get('user')
        const passwordCorrect = loginUser === null ? false :
          await bcrypt.compare(body.password, loginUser.properties.passwordHash)

        if (!(loginUser && passwordCorrect)) {
          return res.status(401).json({ error: 'invalid username or password' })
        }

        const username = loginUser.properties.username
        const user_id = loginUser.properties.user_id
        const name = loginUser.properties.name
        const role = loginUser.properties.role
        const user: ClientUser = { username, name, role }
        const userForToken: Token = { username, user_id, role }
        const token = jwt.sign(userForToken, process.env.SECRET)

        res.status(200).send({ token, user })

      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'something went wrong...' })
      }
    }
  )
}
