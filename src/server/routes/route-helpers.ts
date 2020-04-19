import { GraphNodeIn, ScentItem, NeoInteger } from '../../common/data-classes'
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
