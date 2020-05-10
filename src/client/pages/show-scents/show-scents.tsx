import * as React from 'react'
import { DEFAULT_PROPS, matchInput } from '../../utils'
import { ScentItem } from '../../../common/data-classes'
import { getAll } from '../../services'
import Autocomplete from 'react-autocomplete'
import { Button } from 'react-bootstrap'
import { ScentGraph } from './scent-graph'
import { Notification } from '../../components'

interface ShowScentsState {
  message: string,
  name: string,
  nameToGraph: string,
  allCategories: ScentItem[],
  allBrands: ScentItem[],
  allNotes: ScentItem[],
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
      allNotes: [],
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
    await getAll('note').then(response => {
      this.setState({ allNotes: response })
    })
  }

  isDisabled(): boolean {
    if (this.state.type === 'category') {
      return !this.isOneOfTheCategories()
    } else if (this.state.type === 'brand') {
      return !this.isOneOfTheBrands()
    } else if (this.state.type === 'note') {
      return !this.isOneOfTheNotes()
    }
    return true
  }

  isOneOfTheCategories(): boolean {
    return this.state.name !== '' && this.state.type === 'category' &&
      this.state.allCategories && (this.getNames(this.state.allCategories)).includes(this.state.name)
  }

  isOneOfTheBrands(): boolean {
    return this.state.name !== '' && this.state.type === 'brand' &&
      this.state.allBrands && (this.getNames(this.state.allBrands)).includes(this.state.name)
  }

  isOneOfTheNotes(): boolean {
    return this.state.name !== '' && this.state.type === 'note' &&
      this.state.allNotes && (this.getNames(this.state.allNotes)).includes(this.state.name)
  }

  getNames(items: ScentItem[]): string[] {
    return items.map(item => item.name)
  }

  itemListChooser(): ScentItem[] {
    if (this.state.type === 'category') {
      return this.state.allCategories
    } else if (this.state.type === 'brand') {
      return this.state.allBrands
    } else if (this.state.type === 'note') {
      return this.state.allNotes
    }
    return []
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

  handleClick = (type) => this.setState({ type, name: '' })


  public render(): JSX.Element {

    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Show all scents from a
          <> {' '}
            <Button variant="outline-danger" onClick={() => this.handleClick('category')}>Category</Button>{' '}
            <Button variant="outline-success" onClick={() => this.handleClick('brand')}>Brand</Button>{' '}
            <Button variant="outline-primary" onClick={() => this.handleClick('note')}>Note</Button>
          </>
        </h2>

        {this.state.type !== '' && this.state.allCategories && this.state.allBrands &&  this.state.allNotes &&
          <form onSubmit={this.onSubmit}>
            <p>Select {this.state.type}:</p>
            <Autocomplete
              value={this.state.name}
              inputProps={{ id: 'category-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.itemListChooser()}
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
