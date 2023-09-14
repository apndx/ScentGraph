import * as React from 'react'
import { Notification } from '../../components'
import { ScentGraph } from '../../components/scent-graph'
import { DEFAULT_PROPS } from '../../utils'
import { seasonDecider, timeDecider } from '../../../common/utils'

interface CurrentState {
  message: string,
  nameToGraph: string,
  type: string,
  physics: boolean,
  filters: string[]
}

export class Current extends React.Component<DEFAULT_PROPS, CurrentState> {

  public state: CurrentState
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      nameToGraph: 'current',
      type: 'current',
      physics: true,
      filters: [],

    }
  }

  public render(): JSX.Element {
    const season = seasonDecider(new Date())
    const time = timeDecider()

    return (
      <div>
        <div className='container'>
        <h1 className='label'>Welcome to ScentGraph</h1>
          <Notification message={this.state.message} />
          <p>Here is a random sample from the scent collection for a {season} {time} </p>
          {this.state.nameToGraph &&
            <div>
              <p></p>
              <ScentGraph
                containerId={'front-page'}
                backgroundColor={'#e4e6e1'}
                nameToGraph={this.state.nameToGraph}
                type={this.state.type}
                physics={this.state.physics}
                filters={this.state.filters}
              />
            </div>
          }
        </div>
        <style jsx>{`
        .label {
          margin-top: 12px;
          margin-bottom: 4px;
        }

        .container {
          margin-left: 60px;
        }

      `}</style>
      </div>
    )
  }
}
