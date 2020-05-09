import * as React from 'react'
import { DEFAULT_PROPS, matchInput } from '../../utils'
import { ScentItem } from '../../../common/data-classes'
import { getAll } from '../../services'
import Autocomplete from 'react-autocomplete'
import { Button } from 'react-bootstrap'
import { ScentGraph } from './scent-graph'
import Notification from '../../components/notification'

interface ShowScentsState {
  message: string,
  name: string,
  nameToGraph: string,
  allCategories: ScentItem[],
  allBrands: ScentItem[],
  type: string
}

export class ShowScents extends React.PureComponent<DEFAULT_PROPS, ShowScentsState> {
  public state: ShowScentsState

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      name: '',
      nameToGraph: '',
      allCategories: [],
      allBrands: [],
      type: ''
    }
  }

  public async componentDidMount() {
    await getAll('category').then(response => {
      this.setState({ allCategories: response })
    })
    await getAll('brand').then(response => {
      this.setState({ allBrands: response })
    })
  }

  isDisabled(): boolean {
    return this.state.type === 'category' ? !this.isOneOfTheCategories() : !this.isOneOfTheBrands()
  }

  isOneOfTheCategories(): boolean {
    return this.state.name !== '' && this.state.type === 'category' &&
      this.state.allCategories && (this.getNames(this.state.allCategories)).includes(this.state.name)
  }

  isOneOfTheBrands(): boolean {
    return this.state.name !== '' && this.state.type === 'brand' &&
      this.state.allBrands && (this.getNames(this.state.allBrands)).includes(this.state.name)
  }

  getNames(items: ScentItem[]): string[] {
    return items.map(item => item.name)
  }

  onSubmit = async (event) => {
    event.preventDefault()
    try {
      if (this.state.name !== '') {
        this.setState({
          nameToGraph: this.state.name
        })
      }
    } catch (e) {
      this.setState({ message: `Could not show ScentGraph. ${e}` })
    }
  }

  handleClick = (type) => this.setState({ type })


  public render(): JSX.Element {

    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Show all scents from a
          <> {' '}
            <Button variant="outline-danger" onClick={() => this.handleClick('category')}>Category</Button>{' '}
            <Button variant="outline-success" onClick={() => this.handleClick('brand')}>Brand</Button>
          </>
        </h2>

        {this.state.type !== '' && this.state.allCategories && this.state.allBrands &&
          <form onSubmit={this.onSubmit}>
            <p>Select {this.state.type}:</p>
            <Autocomplete
              value={this.state.name}
              inputProps={{ id: 'category-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.state.type === 'category' ?
                this.state.allCategories : this.state.allBrands}
              getItemValue={(item: ScentItem) => item.name}
              shouldItemRender={matchInput}
              onChange={(event, value) => this.setState({ name: value })}
              onSelect={value => this.setState({ name: value })}
              renderMenu={children => (
                <div className="menu">
                  {children}
                </div>
              )}
              renderItem={(item, isHighlighted) => (
                <div
                  className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                  key={item.id}
                >{item.name}</div>
              )}
            />
            <p></p>
            <div>
              <Button disabled={this.isDisabled()} variant="outline-info" type="submit">show</Button>
            </div>
          </form>}

        {this.state.nameToGraph &&
          <ScentGraph
            containerId={'category-scents'}
            backgroundColor={'#e4e6e1'}
            nameToGraph={this.state.nameToGraph}
            type={this.state.type}
          />
        }
      </div>
    )
  }

}
