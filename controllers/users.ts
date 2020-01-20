export {}
const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const neode = require('neode')
import { Request, Response } from 'express'

export const postUser: any = async (request: Request, response: Response) => {
    try {
        const body = request.body
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
        .hash('some-password-here', saltRounds)

        .then((hash: any) =>{
        Promise.all([
           instance.create('User', {name: 'name', username: 'username', passwordHash: hash}),
           // instance.create('Scent', {scentname: 'Curious In Control'})
        ])
    })
   
    
    .then(() => instance.close())

    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
      }
}
