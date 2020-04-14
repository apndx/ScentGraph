import { GraphNodeIn } from '../../../common/data-classes'

export function getCategoryName(node: GraphNodeIn): string {
    if (node.properties.categoryname) {
        return  node.properties.categoryname
    }
    return ''
}
