import * as React from 'react'
import {
  DEFAULT_PROPS,
  matchInput,
  matchScentInput,
  sortNames,
  SessionStorageItem,
  scentNamesBrands
} from '../../utils'
import { ScentItem } from '../../../common/data-classes'
import { getAll } from '../../services'
import Autocomplete from 'react-autocomplete'
import { Button } from 'react-bootstrap'
import { ScentGraph } from './scent-graph'
import { Notification } from '../../components'
import {
  categoryStyle,
  brandStyle,
  noteStyle,
  genderStyle,
  seasonStyle,
  timeStyle,
  userStyle,
  scentStyle
} from './show-scent-styles'

interface ShowScentsState {
  message: string,
  name: string,
  nameToGraph: string,
  allScents: ScentItem[],
  allCategories: ScentItem[],
  allBrands: ScentItem[],
  allNotes: ScentItem[],
  allGenders: ScentItem[],
  allSeasons: ScentItem[],
  allTimes: ScentItem[],
  type: string,
  physics: boolean,
  loggedUser: ScentItem[],
  filters: string[]
}

export class ShowScents extends React.PureComponent<DEFAULT_PROPS, ShowScentsState> {
  public state: ShowScentsState

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      name: '',
      nameToGraph: '',
      allScents: [],
      allCategories: [],
      allBrands: [],
      allNotes: [],
      allGenders: [],
      allSeasons: [],
      allTimes: [],
      loggedUser: [],
      type: '',
      physics: true,
      filters: []
    }
  }

  public async componentDidMount() {
    await getAll('scents').then(response => {
      this.setState({ allScents: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
    await getAll('category').then(response => {
      this.setState({ allCategories: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
    await getAll('brand').then(response => {
      this.setState({ allBrands: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
    await getAll('note').then(response => {
      this.setState({ allNotes: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
    await getAll('gender').then(response => {
      this.setState({ allGenders: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
    await getAll('season').then(response => {
      this.setState({ allSeasons: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
    await getAll('time').then(response => {
      this.setState({ allTimes: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
    const loggedUser = this.loggedUser() === '' ? [] : [{ name: this.loggedUser(), id: 1 }]
    this.setState({ loggedUser })
  }

  loggedUser(): string {
    return window.sessionStorage.getItem(SessionStorageItem.LoginUser) || ''
  }

  isDisabled(): boolean {
    if (this.state.type && this.state.type !== 'scent') {
      return !this.isOneOfTheCollection(this.state.type)
    } else if (this.state.type === 'scent') {
      return this.state.allScents.length > 0 && !(scentNamesBrands(this.state.allScents)).includes(this.state.name)
    }
    return true
  }

  isOneOfTheCollection(type: string): boolean {
    return this.state.name !== '' && this.state.type === type &&
      this.relevantCollection().length > 0 && (this.getNames(this.relevantCollection())).includes(this.state.name)
  }

  relevantCollection(): ScentItem[] {
    const type = this.state.type

    if (type === 'category') {
      return this.state.allCategories
    } else if (type === 'brand') {
      return this.state.allBrands
    } else if (type === 'note') {
      return this.state.allNotes
    } else if (type === 'gender') {
      return this.state.allGenders
    } else if (type === 'season') {
      return this.state.allSeasons
    } else if (type === 'time') {
      return this.state.allTimes
    } else if (type === 'user') {
      return this.state.loggedUser
    } else if (type === 'scent') {
      return this.state.allScents
    }
    return []
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

  handleClick = (type) => this.setState({ type, name: '' })

  handleFilter = (filter: string) => {
    const filtered = this.state.filters
    if (filtered.includes(filter)) {
      const edited = filtered.filter(f => { f !== filter })
      this.setState({ filters: edited })
    } else {
      const edited = filtered.concat(filter)
      this.setState({ filters: edited })
    }
  }

  toggleAction = () => this.setState({ physics: !this.state.physics })

  togglePhysicsButtonText(): string {
    return this.state.physics ? 'Turn Physics Off' : 'Turn Physics On'
  }

  toggleFilterButtonText(filter: string): string {
    return this.state.filters.includes(filter) ? `Return ${filter}` : `Filter ${filter}`
  }

  public render(): JSX.Element {

    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Show Scents by
          <> {' '}
            <Button style={scentStyle} onClick={() => this.handleClick('scent')}>Name</Button>{' '}
            <Button style={categoryStyle} onClick={() => this.handleClick('category')}>Category</Button>{' '}
            <Button style={brandStyle} onClick={() => this.handleClick('brand')}>Brand</Button>{' '}
            <Button style={noteStyle} onClick={() => this.handleClick('note')}>Note</Button>{' '}
            <Button style={genderStyle} onClick={() => this.handleClick('gender')}>Gender</Button>{' '}
            <Button style={seasonStyle} onClick={() => this.handleClick('season')}>Season</Button>{' '}
            <Button style={timeStyle} onClick={() => this.handleClick('time')}>Time of Day</Button>{' '}
            {this.loggedUser() !== '' && <Button style={userStyle} onClick={() => this.handleClick('user')}>I Added It</Button>}
          </>
        </h2>

        {this.relevantCollection().length > 0 &&
          <form onSubmit={this.onSubmit}>
            <p>Select {this.state.type}:</p>
            <Autocomplete
              value={this.state.name}
              inputProps={{ id: 'category-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.relevantCollection()}
              getItemValue={(item: ScentItem) => this.state.type === 'scent' ?
                `${item.name} - ${item.brand}` : item.name}
              shouldItemRender={this.state.type === 'scent' ? matchScentInput : matchInput}
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
                >{this.state.type === 'scent' ? `${item.name} - ${item.brand}` : item.name}</div>
              )}
            />
            <p></p>
            <div>
              <Button disabled={this.isDisabled()} variant="outline-info" type="submit">Show</Button>{' '}
              {this.state.nameToGraph && <Button variant="outline-info"
                onClick={() => this.toggleAction()}>{this.togglePhysicsButtonText()}</Button>}{' '}
              {this.state.nameToGraph && <Button style={categoryStyle}
                onClick={() => this.handleFilter('Category')}>{this.toggleFilterButtonText('Category')}</Button>}{' '}
              {this.state.nameToGraph && <Button style={brandStyle}
                onClick={() => this.handleFilter('Brand')}>{this.toggleFilterButtonText('Brand')}</Button>}{' '}
              {this.state.nameToGraph && <Button style={noteStyle}
                onClick={() => this.handleFilter('Note')}>{this.toggleFilterButtonText('Note')}</Button>}{' '}
              {this.state.nameToGraph && <Button style={genderStyle}
                onClick={() => this.handleFilter('Gender')}>{this.toggleFilterButtonText('Gender')}</Button>}{' '}
              {this.state.nameToGraph && <Button style={seasonStyle}
                onClick={() => this.handleFilter('Season')}>{this.toggleFilterButtonText('Season')}</Button>}{' '}
              {this.state.nameToGraph && <Button style={timeStyle}
                onClick={() => this.handleFilter('TimeOfDay')}>{this.toggleFilterButtonText('TimeOfDay')}</Button>}{' '}
              {this.state.nameToGraph && <Button style={userStyle}
                onClick={() => this.handleFilter('User')}>{this.toggleFilterButtonText('User')}</Button>}{' '}
            </div>
          </form>}

        {this.state.nameToGraph &&
          <div>
            <p></p>
            <ScentGraph
              containerId={'category-scents'}
              backgroundColor={'#e4e6e1'}
              nameToGraph={this.state.nameToGraph}
              type={this.state.type}
              physics={this.state.physics}
              filters={this.state.filters}
            />
          </div>
        }
      </div>
    )
  }

}
