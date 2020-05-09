import {
  GraphNodeIn,
  GraphEdgeIn,
  ScentItem,
  NeoInteger,
  GraphNodeOut,
  GraphEdgeOut,
  AdminContent,
  NeodeBatchQueryItem
} from '../../common/data-classes'
import * as neo4j from 'neo4j-driver'

export function getName(node: GraphNodeIn): ScentItem {
  if (node.properties.brandname) {
    return {
      id: toSmallInteger(node.identity),
      name: node.properties.brandname
    }
  } else if (node.properties.categoryname) {
    return {
      id: toSmallInteger(node.identity),
      name: node.properties.categoryname
    }
  } else if (node.properties.notename) {
    return {
      id: toSmallInteger(node.identity),
      name: node.properties.notename
    }
  } else {
    return {
      id: toSmallInteger(node.identity),
      name: ''
    }
  }
}

export function getScentNameAndBrand(scent: GraphNodeIn, brand: GraphNodeIn): ScentItem {
  if (scent.properties.scentname && brand.properties.brandname) {
    return {
      id: toSmallInteger(scent.identity),
      name: scent.properties.scentname,
      brand: brand.properties.brandname
    }
  } else {
    return {
      id: toSmallInteger(scent.identity),
      name: ''
    }
  }
}

export function isUniqueNode(nodes: GraphNodeOut[], node: any): boolean {
  return node && nodes.filter(n => n.id === toSmallInteger(node.identity)).length === 0
}

export function toSmallInteger(numberToConvert: NeoInteger): number {
  return neo4j.int(numberToConvert).toNumber()
}

export function nodeConverter(node: GraphNodeIn): GraphNodeOut {
  return ({
    id: toSmallInteger(node.identity),
    label: extractName(node.properties),
    title: extractName(node.properties),
    group: node.labels[0],
    properties: node.properties,
    labels: node.labels
  })
}

export function extractName(properties: any): string {
  const key = Object.keys(properties).find(key => key.includes('name'))
  return key ? properties[key] : ''
}

export function edgeConverter(edge: GraphEdgeIn): GraphEdgeOut {
  return ({
    id: toSmallInteger(edge.identity).toString(),
    from: toSmallInteger(edge.start),
    to: toSmallInteger(edge.end),
    label: edge.type,
    properties: edge.properties,
    title: edge.type
  })
}

export function isNotNull(item: any): boolean {
  return item !== null
}

export function paramsForScentGraph(item: AdminContent): any {
  const type = item.type.toLowerCase()
  const value = item.itemName.toLowerCase()
  const key = `${type}name`
  let params: any = {}
  params[key] = value
  return params
}

export function getScentFromCypher(item: AdminContent): string {
  const type = item.type.toLowerCase()
  const name = `${type}name`
  return `
    MATCH (scent:Scent) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    WHERE toLower(${type}.${name}) = toLower({${name}})
    return scent, category, brand, season, time, gender,
    belcategory, belbrand, belseason, beltime, belgender`
}

export function batchHelper(notes: string[]): NeodeBatchQueryItem[] {
  return notes.map((note: string) => {
    return {
      query: `MERGE (note:Note {notename: {notename}}) RETURN note`,
      params: { notename: note }
    }
  })
}

export function promiseForBatch(instance: any, notes: string[]) {
  return notes.map((note: string) => {
    return (instance.create('Note', { notename: note }))
  })
}
