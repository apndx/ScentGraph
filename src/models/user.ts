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
