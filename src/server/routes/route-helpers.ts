import { AnyAaaaRecord } from 'dns'
import {
  GraphNodeIn,
  GraphEdgeIn,
  ScentItem,
  NeoInteger,
  GraphNodeOut,
  GraphEdgeOut,
  AdminContent,
  NeodeBatchQueryItem,
  NodePropertiesOut,
  Season,
  TimeOfDay
} from '../../common/data-classes'
import * as neo4j from 'neo4j-driver'

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
  const date: Date = new Date(node.properties.created_at)
  const hours = timeHelper(date.getHours())
  const mins = timeHelper(date.getMinutes())
  const nodeProperties: NodePropertiesOut = {
    ...(node.properties && { name: extractName(node.properties) }),
    ...(node.labels && { type: node.labels[0] }),
    ...(node.properties.label && { label: node.properties.label }),
    ...(node.properties.created_at &&
      { created: `${date.toDateString()} ${hours}:${mins}` }),
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

export function timeHelper(time: number): string {
  const timeString = time.toString()
  if (timeString.length === 1) {
    return `0${timeString}`
  }
  return timeString
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

export function scentGraphParams(item: AdminContent): any {
  const type = item.type.toLowerCase()
  const value = item.itemName.toLowerCase()
  const key = `${type}name`
  let params: any = {}
  params[key] = value
  return params
}

export function scentGraphByNameParams(item: AdminContent): any {
  const scentArray = item.itemName.split(' - ')
  const scentname = scentArray[0]
  const brandname = scentArray[1]
  return { scentname: scentname, brandname: brandname }
}

export function scentGraphCurrentParams(): any {
  const season = seasonDecider()
  const time = timeDecider()
  return { seasonname: season, timename: time }
}

export function paramDecider(item: AdminContent): any {
  const type = item.type
  switch (type) {
    case 'scent':
      return scentGraphByNameParams(item)
    case 'current':
      return scentGraphCurrentParams()
    default:
      return scentGraphParams(item)
  }
}

export function cypherDecider(item: AdminContent): string {
  if (item.type === 'note') {
    return getScentFromNoteCypher(item)
  } else if (item.type === 'scent') {
    return getScentfromNameCypher()
  } else if (item.type === 'current') {
    return getCurrentScentCypher()
  }
  else {
    return getScentFromCypher(item)
  }
}

export function getScentfromNameCypher(): string {
  return `
    MATCH (scent:Scent{scentname:$scentname}) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand{brandname:$brandname})
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    MATCH (scent:Scent)<-[addedby:ADDED]-(user:User)
    return scent, category, brand, season, time, gender, user,
    belcategory, belbrand, belseason, beltime, belgender, addedby`
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
    WHERE toLower(${type}.${name}) = toLower($${name})
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
    WHERE toLower(${type}.${name}) = toLower($${name})
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
    WHERE toLower(${type}.${name}) = toLower($${name})
    return scent, category, brand, season, time, gender, note,
    belcategory, belbrand, belseason, beltime, belgender, hasnote`
}


export function getCurrentScentCypher(): string {
  return `
	MATCH (scent:Scent) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    MATCH (scent:Scent)<-[addedby:ADDED]-(user:User)
    WHERE toLower(season.seasonname) = toLower($seasonname)
    AND toLower(time.timename) = toLower($timename)
    return scent, category, brand, season, time, gender, user,
    belcategory, belbrand, belseason, beltime, belgender, addedby`
}

export function batchHelper(notes: string[]): NeodeBatchQueryItem[] {
  return notes.map((note: string) => {
    return {
      query: `MERGE (note:Note {notename:$notename}) RETURN note`,
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

function seasonDecider(): Season {
    // Northern hemisphere (Winter as Dec/Jan/Feb etc...)
  const getSeason = (d: Date) => Math.floor((d.getMonth() / 12 * 4)) % 4
  return [Season.Winter, Season.Spring, Season.Summer, Season.Autumn][getSeason(new Date())]
}

function timeDecider(): TimeOfDay {
    // Breakpoints at 05:00 AM and 17:00 PM
  const hours: number = new Date().getHours()
  return (hours > 4 && hours < 17) ? TimeOfDay.Day : TimeOfDay.Night
}
