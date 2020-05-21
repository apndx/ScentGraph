export const brand = {
  brand_id: {
    type: 'uuid',
    primary: true
  },
  brandname: {
    type: 'string',
    index: true
  },
  has: {
    type: 'relationship',
    relationship: 'HAS',
    direction: 'out',
    properties: {
      since: {
        type: 'localdatetime',
        default: () => new Date()
      }
    }
  },
  belongs: {
    type: 'relationship',
    relationship: 'BELONGS',
    direction: 'in',
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
