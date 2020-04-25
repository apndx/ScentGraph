export interface GraphNodeIn {
  'identity': NeoInteger,
  'labels': string[],
  'properties': any
}

export interface NeoInteger {
  'low': number,
  'high': number
}

export interface GraphEdgeIn {
  'identity': NeoInteger,
  'start': NeoInteger,
  'end': NeoInteger,
  'type': string,
  'properties': any
}
