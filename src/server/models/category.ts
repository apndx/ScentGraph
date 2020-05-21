export const category = {
  category_id: {
    type: 'uuid',
    primary: true
  },
  categoryname: {
    type: 'string',
    index: true
  },
  label: {
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
      },
      width: {
        type: 'number',
        default: 50
      }
    }
  },
  createdAt: {
    type: 'datetime',
    default: () => new Date()
  }
}
