import { isUniqueGraphNode, isUniqueGraphEdge } from '../utils'
import { GraphEdgeOut, GraphNodeOut } from '../../common/data-classes'
import { loadFixtureFile } from '../../common/test-utils'

describe('Graph helper', () => {

    const edgesOut = loadFixtureFile<GraphEdgeOut[]>('edges-out.json')
    const notesOut = loadFixtureFile<GraphNodeOut[]>('notes-out.json')
    const seasonsOut = loadFixtureFile<GraphNodeOut[]>('seasons-out.json')

    it('should recognize double edge', async () => {
        const doubleEdge: GraphEdgeOut = edgesOut[0]
        expect(isUniqueGraphEdge(edgesOut, doubleEdge)).toEqual(false)
    })

    it('should recognize unique edge', async () => {
        const uniqueEdge: GraphEdgeOut = { id: '466', from: 0, to: 261, properties: {}, title: 'ADDED' }
        expect(isUniqueGraphEdge(edgesOut, uniqueEdge)).toEqual(true)
    })

    it('should recognize double node', async () => {
        const doubleNote: GraphNodeOut = notesOut[0]
        expect(isUniqueGraphNode(notesOut, doubleNote)).toEqual(false)
    })

    it('should recognize unique node', async () => {
        const uniqueNode: GraphNodeOut = seasonsOut[0]
        expect(isUniqueGraphNode(notesOut, uniqueNode)).toEqual(true)
    })

})

