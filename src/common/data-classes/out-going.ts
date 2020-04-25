export interface GraphNodeOut {
  id: number,
  label: string,
  title: string,
  group: string,
  properties: any,
  x?: number,
  y?: number,
  fixed?: boolean,
  labels: string[]
}

export interface GraphEdgeOut {
  id: string,
  from: number,
  to: number,
  label?: string,
  title: string,
  properties: any
}
