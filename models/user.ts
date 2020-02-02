// export {}
// const neode = require('neode')
// /**
//  * User Definition
//  */
// const userSchema = new neode.Schema ({
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

// const User = neode.model('User', userSchema)

// module.exports = User

export interface User {
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
                type: 'localdatetime'
            },
        },
    },
    createdAt: {
        type: 'datetime'
    }
}
