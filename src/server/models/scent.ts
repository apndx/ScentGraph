export const scent = {
  scent_id: {
    type: 'uuid',
    primary: true
  },
  scentname: {
    type: 'string',
    index: true
  },
  description: {
    type: 'string'
  },
  url: {
    type: 'string'
  },
  has: {
    type: 'relationship',
    relationship: 'HAS',
    direction: 'both',
    properties: {
      since: {
        type: 'localdatetime',
        default: () => new Date()
      },
      width: {
        type: 'number',
        default: 50
      }
    }
  },
  belongs: {
    type: 'relationship',
    relationship: 'BELONGS',
    direction: 'both',
    properties: {
      since: {
        type: 'localdatetime',
        default: () => new Date()
      }
    }
  },
  createdAt: {
    type: 'datetime',
    default: () => new Date()
  }
}
