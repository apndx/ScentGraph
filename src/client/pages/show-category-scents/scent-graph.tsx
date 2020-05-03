import * as React from 'react'
import Graph from 'vis-react'
import { getScentsFromCategory } from '../../services'
import { GraphResult } from '../../../common/data-classes'
import { groupStyles } from './group-styles'

export interface ScentGraphState {
  errorMessage?: string,
  visRef: React.RefObject<any>,
  graph: GraphResult,
  options: any,
  events: any,
  loading: boolean,
  network: any,
  windowWidth: number,
  windowHeight: number
}

export interface ScentGraphProps {
  containerId: string
  backgroundColor: string
  categorynameToGraph?: string
}

export class ScentGraph extends React.PureComponent<ScentGraphProps, ScentGraphState> {
  private events: {}
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
      windowHeight: 1000
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
    this.events = {}
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  public async componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
    this.graphUpdate()
  }

  public async componentDidUpdate(prevProps: ScentGraphProps) {
    if (this.props.categorynameToGraph !== prevProps.categorynameToGraph) {
      this.graphUpdate()
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  private updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight })
  }

  private async graphUpdate() {
    try {
      this.setState({ loading: true })
      const graph: GraphResult = await getScentsFromCategory(this.props.categorynameToGraph)
      this.setState({
        options: this.options,
        graph,
        loading: false
      })
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