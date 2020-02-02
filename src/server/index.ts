//import * as express from 'express'
//const express = require('express')
//const neode = require('neode')
// Create a new express application instance
//const app: express.Application = express();
//const bcrypt = require('bcryptjs')

//const app = express()
//import { User } from '../../models/user'

//const User = require('../models/user')

//const User = require('./models/Juser')

// const instance = new neode.fromEnv()

/* instance.with( {
    User: User,
    Scent: Scent
}) */

//  instance.model('User', {
//     user_id: {
//         type: 'uuid',
//         primary: true,
//     },
//     username: {
//         type: 'string',
//     },
//     passwordHash: {
//         type: 'string',
//     },
//     name: {
//         type: 'string',
//         index: true,
//     },
//     has: {
//         type: 'relationship',
//         relationship: 'HAS',
//         direction: 'out',
//         properties: {
//             since: {
//                 type: 'localdatetime',
//                 default: () => new Date,
//             },
//         },
//     },
//     createdAt: {
//         type: 'datetime',
//         default: () => new Date,
//     }
// })

// instance.model('User', Juser)

// const saltRounds = 10

//     bcrypt
//         .hash('some-password-here', saltRounds)

//         .then((hash: any) =>{
//         Promise.all([
//            instance.create('User', {name: 'some-name', username: 'some-user', passwordHash: hash, createdAte: () => new Date}),
//            // instance.create('Scent', {scentname: 'Curious In Control'})
//         ])
//     })

//     .then(() => instance.close())

/**
 * Log out some details and relate the two together
 */
//.then(([heli, curious]) => {
//    console.log('heli', heli.id(), heli.get('user_id'), heli.get('name'));
//    console.log('curious', curious.id(), curious.get('scent_id'), curious.get('name'));

// return heli.relateTo(heli, 'has', {since: new Date('2015-01-02 12:34:56')});
//})

/**
 * Log out relationship details
 */
// .then(rel => {
//     console.log('rel', rel.id(), rel.get('since'));

//     return rel;
// })

/**
 * Close Driver
 */

// app.get('/', function (req, res) {
//   res.send('Hello ScentGraph!');
// })

// app.listen(3001, function () {
//   console.log('Initial server app listening on port 3001!');
// })

import { loadServerConfig, configureNeo4jDriver } from "./config"
import { startServer, stopServer } from "./server"
import * as dotenv from 'dotenv'
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config()
// }
const config = loadServerConfig()


if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const neo4jUser = process.env.NEO4J_USERNAME
const neo4jPass = process.env.NEO4J_PASSWORD
const driver = configureNeo4jDriver(config.neo4jUrl, neo4jUser, neo4jPass)

const server = startServer(config, driver)
server.then(instance => {
  process.on("SIGINT", async () => {
    stopServer(instance, driver)
  })
})
