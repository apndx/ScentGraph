import * as React from 'react'
import { DEFAULT_PROPS, matchInput, sortNames, SessionStorageItem } from '../../utils'
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
  userStyle
} from './show-scent-styles'

interface ShowScentsState {
  message: string,
  name: string,
  nameToGraph: string,
  allCategories: ScentItem[],
  allBrands: ScentItem[],
  allNotes: ScentItem[],
  allGenders: ScentItem[],
  allSeasons: ScentItem[],
  allTimes: ScentItem[],
  type: string,
  physics: boolean,
  loggedUser: ScentItem[],
  filter: string
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
      allGenders: [],
      allSeasons: [],
      allTimes: [],
      loggedUser: [],
      type: '',
      physics: true,
      filter: ''
    }
  }

  public async componentDidMount() {
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
    if (this.state.type) {
      return !this.isOneOfTheCollection(this.state.type)
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

  handleClick = (type) => this.setState({ type, name: '', filter: '' })

  handleFilter = (filter) => this.setState({ filter })

  toggleAction = () => this.setState({ physics: !this.state.physics })

  toggleText(): string {
    return this.state.physics ? 'Turn Physics Off' : 'Turn Physics On'
  }

  public render(): JSX.Element {

    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Show Scents
          <> {' '}
            <Button style={categoryStyle} onClick={() => this.handleClick('category')}>Category</Button>{' '}
            <Button style={brandStyle} onClick={() => this.handleClick('brand')}>Brand</Button>{' '}
            <Button style={noteStyle} onClick={() => this.handleClick('note')}>Note</Button>{' '}
            <Button style={genderStyle} onClick={() => this.handleClick('gender')}>Gender</Button>{' '}
            <Button style={seasonStyle} onClick={() => this.handleClick('season')}>Season</Button>{' '}
            <Button style={timeStyle} onClick={() => this.handleClick('time')}>Time of Day</Button>{' '}
            {this.loggedUser() !== '' && <Button style={userStyle} onClick={() => this.handleClick('user')}>Added by Me</Button>}
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
              <Button disabled={this.isDisabled()} variant="outline-info" type="submit">Show</Button>{' '}
              {this.state.nameToGraph && <Button variant="outline-info" onClick={() => this.toggleAction()}>{this.toggleText()}</Button>}{' '}
              {this.state.nameToGraph && <Button style={brandStyle} onClick={() => this.handleFilter('Brand')}>Filter Brand</Button>}
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
              filter={this.state.filter}
            />
          </div>
        }
      </div>
    )
  }

}
