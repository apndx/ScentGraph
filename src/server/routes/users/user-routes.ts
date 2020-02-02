import * as express from 'express'
import * as neo4j from 'neo4j-driver'
import Neode = require('neode')
//const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const neode = require('neode')

//const User = require('..models/user')
//import { User } from '../../../../models/user'

export function configureUserRoutes(
    app: express.Application,
    driver: neo4j.Driver,
    apiPath: string

): void {
    const USERS_PATH = `${apiPath}/users`

    app.post(`${USERS_PATH}/add`, async (req: express.Request, res: express.Response) => {
        const body = await req.body
        const instance = new neode.fromEnv()
       
        instance.model('User', {
            user_id: {
                type: 'uuid',
                primary: true,
            },
            username: {
                type: 'string',
            },
            passwordHash: {
                type: 'string',
            },
            name: {
                type: 'string',
                index: true,
            },
            has: {
                type: 'relationship',
                relationship: 'HAS',
                direction: 'out',
                properties: {
                    since: {
                        type: 'localdatetime',
                        default: () => new Date,
                    },
                },
            },
            createdAt: {
                type: 'datetime',
                default: () => new Date,
            }
        })

        const saltRounds = 10

        bcrypt
            .hash(req.body.password, saltRounds)

            .then((hash: string) => {
                return Promise.all([
                    instance.create('User', { name: req.body.name, username: req.body.username, passwordHash: hash }),
                    // instance.create('Scent', {scentname: 'Curious In Control'})
                ])
            })
            
            .then(() => instance.close())
        
    })
}
