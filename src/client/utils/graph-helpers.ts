import { GraphNodeOut, GraphEdgeOut } from '../../common/data-classes'

export function isUniqueGraphNode(nodes: GraphNodeOut[], node: any): boolean {
    return node && nodes.filter(n => n.id === node.id).length === 0
}

export function isUniqueGraphEdge(edges: GraphEdgeOut[], edge: any): boolean {
    return edge && edges.filter(e => e.id === edge.id).length === 0
}
