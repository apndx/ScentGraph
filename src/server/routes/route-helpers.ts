import { GraphNodeIn } from '../../common/data-classes'

export function getName(node: GraphNodeIn): string {
  if (node.properties.brandname) {
    return node.properties.brandname
  } else if (node.properties.categoryname) {
    return node.properties.categoryname
  } else if (node.properties.notename) {
    return node.properties.notename
  }
  return ''
}
