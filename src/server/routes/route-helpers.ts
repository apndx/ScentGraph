import {
  GraphNodeIn,
  GraphEdgeIn,
  ScentItem,
  NeoInteger,
  GraphNodeOut,
  GraphEdgeOut
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
  }
  return {
    id: toSmallInteger(node.identity),
    name: ''
  }
}

export function toSmallInteger(numberToConvert: NeoInteger): number {
  return neo4j.int(numberToConvert).toNumber()
}

export function nodeConverter(node: GraphNodeIn): GraphNodeOut {
  return ({
    id: toSmallInteger(node.identity),
    label: node.labels[0],
    title: extractName(node.properties),
    group: node.labels[0],
    properties: node.properties,
    labels: node.labels
  })
}

export function extractwtf(properties: any): string {
  if (Object.keys(properties).some(function (k) {
    console.log(~k.indexOf("name"))
    return ~k.indexOf("name")
  })) {
  }
  return ''
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
