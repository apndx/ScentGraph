import * as React from 'react'
import Graph from 'vis-react'
import { getScentsFrom, notesForGraph } from '../services'
import { GraphResult, AdminContent, GraphNodeOut } from '../../common/data-classes'
import { groupStyles } from '../pages/show-scents/show-scent-styles'
import { isUniqueGraphNode, isUniqueGraphEdge } from '../utils'

export interface ScentGraphState {
  errorMessage?: string,
  visRef: React.RefObject<any>,
  graph: GraphResult,
  options: any,
  events: any,
  loading: boolean,
  network: any,
  windowWidth: number,
  windowHeight: number,
  allNodes: GraphNodeOut[]
}

export interface ScentGraphProps {
  containerId: string
  backgroundColor: string
  nameToGraph?: string
  type?: string
  physics: boolean
  filters: string[]
}

export class ScentGraph extends React.Component<ScentGraphProps, ScentGraphState> {
  private events: { doubleClick }
  private options: {
    layout: { hierarchical: boolean }
    edges: { color: string; arrows: { to: { enabled: boolean } } }
    nodes: { shape: string; size: number }
    groups: {}
    physics: { enabled: boolean; barnesHut: { avoidOverlap: number } }
  }

  constructor(props: Readonly<ScentGraphProps>) {
    super(props)
    this.state = {
      errorMessage: null,
      visRef: React.createRef(),
      loading: true,
      graph: null,
      options: {},
      events: {},
      network: null,
      windowWidth: 2000,
      windowHeight: 1000,
      allNodes: []
    }
    this.options = {
      layout: {
        hierarchical: false
      },
      edges: {
        color: '#48808f',
        arrows: {
          to: {
            enabled: true
          }
        }
      },
      nodes: {
        shape: 'dot',
        size: 20
      },
      groups: groupStyles,
      physics: {
        enabled: true,
        barnesHut: {
          avoidOverlap: 1
        }
      }
    }
    this.events = {
      doubleClick(event) {
        this.getNotes(event)
      },
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.togglePhysics = this.togglePhysics.bind(this)
    this.events.doubleClick = this.events.doubleClick.bind(this)
    this.getNotes = this.getNotes.bind(this)
  }

  public async componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
    this.graphUpdate()
  }

  public async componentDidUpdate(prevProps: ScentGraphProps) {
    if (this.props.nameToGraph !== prevProps.nameToGraph) {
      this.graphUpdate()
    } else if (this.physicStateNeedsUpdate(prevProps)) {
      this.togglePhysics()
    } else if (this.props.filters !== prevProps.filters) {
      const nodes = this.state.allNodes.filter(node => !this.props.filters.includes(node.group))
      const updatedGraph = { ...this.state.graph, nodes }
      const edges = this.state.graph.edges || null
      this.setState({ graph: updatedGraph })
        const data = {
          nodes,
          edges,
          options: this.state.options
        }
        this.state.network.setData(data)
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  private async getNotes(event) {
    const nodeId = event.nodes[0]
    if (nodeId) {
      const selected = this.state.graph.nodes.find(node => node.id === nodeId)
      if (selected.group === 'Scent') {
        this.setState({ loading: true })
        const noteResult: GraphResult = await notesForGraph(selected.label)
        const noteNodes = noteResult.nodes.filter(node => isUniqueGraphNode(this.state.allNodes, node))
        const noteEdges = noteResult.edges.filter(edge => isUniqueGraphEdge(this.state.graph.edges, edge))
        const filteredNotes = noteNodes.filter(node => !this.props.filters.includes(node.group))
        const allNodes = this.state.allNodes.concat(noteNodes)
        const nodes = this.state.graph.nodes.concat(filteredNotes)
        const edges = this.state.graph.edges.concat(noteEdges)
        this.setState({
          options: this.state.options,
          graph: { nodes, edges },
          loading: false,
          allNodes
        })
        const data = {
          nodes,
          edges,
          options: this.state.options
        }
        this.state.network.setData(data)
      }
    }
  }

  private physicStateNeedsUpdate(prevProps: ScentGraphProps) {
    if (this.state.options && this.state.options.physics) {
      return this.props.physics !== this.state.options.physics.enabled
    }
    return this.props.physics !== prevProps.physics
  }

  private updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight })
  }

  private togglePhysics() {
    const physics = {
      enabled: this.props.physics
    }
    const options = {
      ...this.state.options,
      physics
    }
    this.setState({ options })
    const data = {
      nodes: this.state.graph.nodes,
      edges: this.state.graph.edges,
      options
    }
    this.state.network.setData(data)
  }

  private async graphUpdate() {
    try {
      this.setState({ loading: true })
      const item: AdminContent = { type: this.props.type, itemName: this.props.nameToGraph }
      const graphResult: GraphResult = await getScentsFrom(item)
      this.setState({ allNodes: graphResult.nodes })
      const nodes = graphResult.nodes.filter(node => !this.props.filters.includes(node.group))
      const graph = { ...graphResult, nodes }
      this.setState({
        options: this.options,
        graph,
        loading: false
      })
      const data = {
        nodes,
        edges: this.state.graph.edges,
        options: this.state.options
      }
      this.state.network.setData(data)

    } catch (e) {
      const errorMessage = (e instanceof DOMException) ? 'Failed to load graph' : e.toString()
      this.setState({
        loading: false,
        errorMessage
      })
    }
  }

  private getNetwork = data => {
    this.setState({ network: data })
  }

  public render() {
    return (
      <div>
        {this.renderGraph()}
      </div>
    )
  }

  private renderGraph(): JSX.Element {
    const { backgroundColor } = this.props
    const { windowWidth, windowHeight } = this.state
    return (
      (!this.state.errorMessage && !this.state.loading && Object.entries(this.state.graph).length !== 0 &&
        <Graph graph={this.state.graph}
          style={{
            width: `${windowWidth * 0.81}px`,
            height: `${windowHeight * 0.66}px`,
            backgroundColor: `${backgroundColor}`
          }}
          options={this.state.options}
          events={this.events}
          getNetwork={this.getNetwork}
        />
      )
    )
  }

}
