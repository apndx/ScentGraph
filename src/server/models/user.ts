export const user = {
  user_id: {
    type: "uuid",
    primary: true
  },
  username: {
    type: "string",
    index: true
  },
  passwordHash: {
    type: "string"
  },
  name: {
    type: "string",
    index: true
  },
  role: {
    type: "string",
    default: "user"
  },
  has: {
    type: "relationship",
    relationship: "HAS",
    direction: "out",
    properties: {
      since: {
        type: "localdatetime",
        default: () => new Date()
      },
      description: {
        type: "string"
      }
    }
  },
  likes: {
    type: "relationship",
    relationship: "LIKES",
    direction: "out",
    properties: {
      since: {
        type: "localdatetime",
        default: () => new Date()
      },
      width: {
        type: "number",
        default: 50
      }
    }
  },
  belongs: {
    type: "relationship",
    relationship: "BELONGS",
    direction: "in",
    properties: {
      since: {
        type: "localdatetime",
        default: () => new Date()
      },
    }
  },
  createdAt: {
    type: "datetime",
    default: () => new Date()
  }
}
