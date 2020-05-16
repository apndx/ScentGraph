import {
  GraphNodeIn,
  GraphEdgeIn,
  ScentItem,
  NeoInteger,
  GraphNodeOut,
  GraphEdgeOut,
  AdminContent,
  NeodeBatchQueryItem,
  NodePropertiesOut
} from '../../common/data-classes'
import * as neo4j from 'neo4j-driver'
import * as moment from 'moment'

export function convertToScentItem(node: GraphNodeIn): ScentItem {
  return {
    id: toSmallInteger(node.identity),
    name: extractName(node.properties)
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

export function isUniqueEdge(edges: GraphEdgeOut[], edge: any): boolean {
  return edge && edges.filter(n => n.id ===
    toSmallInteger(edge.identity).toString()).length === 0
}

export function toSmallInteger(numberToConvert: NeoInteger): number {
  return neo4j.int(numberToConvert).toNumber()
}

export function nodeConverter(node: GraphNodeIn): GraphNodeOut {
  const nodeProperties: NodePropertiesOut = {
    ...(node.properties && { name: extractName(node.properties) }),
    ...(node.labels && { type: node.labels[0] }),
    ...(node.properties.label && { label: node.properties.label }),
    ...(node.properties.createdAt &&
      { created: moment(node.properties.createdAt).format('DD.MM.YYYY HH:mm') }),
    ...(node.labels[0] === 'Scent' && { notes: 'Double click to show' })
  }

  return ({
    id: toSmallInteger(node.identity),
    label: node.labels[0] === 'User' ? node.properties.username : extractName(node.properties),
    title: nodeTitleBuilder(nodeProperties),
    group: node.labels[0],
    properties: nodeProperties,
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
    MATCH (scent:Scent)<-[addedby:ADDED]-(user:User)
    WHERE toLower(${type}.${name}) = toLower({${name}})
    return scent, category, brand, season, time, gender, user,
    belcategory, belbrand, belseason, beltime, belgender, addedby`
}

export function getScentFromNoteCypher(item: AdminContent): string {
  const type = item.type.toLowerCase()
  const name = `${type}name`
  return `
    MATCH (scent:Scent) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    MATCH (scent:Scent) -[hasnote:HAS]->(note:Note)
    MATCH (scent:Scent)<-[addedby:ADDED]-(user:User)
    WHERE toLower(${type}.${name}) = toLower({${name}})
    return scent, category, brand, season, time, gender, note, user,
    belcategory, belbrand, belseason, beltime, belgender, hasnote, addedby`
}

export function getallScentsCypher(item: AdminContent): string {
  const type = item.type.toLowerCase()
  const name = `${type}name`
  return `
    MATCH (scent:Scent) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    OPTIONAL MATCH (scent:Scent) -[hasnote:HAS]->(note:Note)
    WHERE toLower(${type}.${name}) = toLower({${name}})
    return scent, category, brand, season, time, gender, note,
    belcategory, belbrand, belseason, beltime, belgender, hasnote`
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

export function nodeTitleBuilder(properties: any): string {
  let title = ''
  for (const key in properties) {
    if (properties.hasOwnProperty(key)) {
      title += `<strong>${key}:</strong> ${properties[key]}<br>`
    }
  }
  return title
}
