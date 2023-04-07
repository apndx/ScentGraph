import * as express from 'express'
import { checkAdmin } from '../../middleware'
import { user } from '../../models'
const bcrypt = require('bcryptjs')
import { ScentItem } from '../../../common/data-classes'
import { convertToScentItem } from '../route-helpers'

export function configureUserRoutes(
  app: express.Application,
  instance: any,
  apiPath: string
): void {
  const USERS_PATH = `${apiPath}/users`

  app.post(
    `${USERS_PATH}/add`,
    async (req: express.Request, res: express.Response) => {

      instance.model('User', user)

      try {
        if (req.body.password.length < 12) {
          return res.status(400).json({ error: 'Password must be at least 12 characters long.' })
        }
        const existingUser = await instance.cypher('MATCH (user:User {username:$username}) return user.username', req.body)
        if (existingUser.records.length > 0) {
          return res.status(400).json({ error: 'Username must be unique.' })
        }

        const saltRounds = 10

        bcrypt
          .hash(req.body.password, saltRounds)

          .then((hash: string) => {
            Promise.all([
              instance.create('User', {
                name: req.body.name,
                username: req.body.username,
                passwordHash: hash
              })
            ])
              .then(([user]) => {
                console.log(`User ${user.properties().name} created`)
                res.send(`User ${user.properties().name} created`)
              })
              .catch((e: any) => {
                console.log('Error :(', e, e.details) // eslint-disable-line no-console
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
        await instance.cypher('MATCH (user:User {username:$username}) DELETE user', req.body)
          .then(() => {
            res.status(200).send('User deleted')
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong in deleting a user' })
      }
    }
  )

  app.put(
    `${USERS_PATH}/role`, checkAdmin,
    async (req: express.Request, res: express.Response) => {
      try {
        const existingUser = await instance.cypher('MATCH (user:User {username:$username}) return user.username', req.body)
        if (existingUser.records.length < 1) {
          return res.status(400).json({ error: 'User not found' })
        } else {
          await instance.cypher(
            `MERGE (user:User {username:$username})
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

  app.post(
    `${USERS_PATH}/loggedUser`,
    async (req: express.Request, res: express.Response) => {

      instance.model('User', user)
      const users: ScentItem[] = []
      try {
        const result = await instance.cypher('MATCH (user:User {username:$username}) return user', req.body)
          .then((result: any) => {
            result.records.map((row: any) => {
              users.push(convertToScentItem(row.get('user')))
            })
            console.log(users)
            res.status(200).send(users)
          })
          .catch((e: any) => {
            console.log('Error :(', e, e.details) // eslint-disable-line no-console
          })
          .then(() => instance.close())
      } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Something went wrong when fetching user' })
      }
    }
  )
}
