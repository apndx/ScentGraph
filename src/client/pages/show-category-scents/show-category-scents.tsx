import * as React from 'react'
import { DEFAULT_PROPS, matchInput } from '../../utils'
import { ScentItem } from '../../../common/data-classes'
import { getAll } from '../../services'
import Autocomplete from 'react-autocomplete'
import { Button } from 'react-bootstrap'
import { ScentGraph } from './scent-graph'
import Notification from '../../components/notification'

interface ShowCategoryScentsState {
  message: string,
  categoryname: string,
  categorynameToGraph: string,
  allCategories: ScentItem[]
}

export class ShowCategoryScents extends React.PureComponent<DEFAULT_PROPS, ShowCategoryScentsState> {
  public state: ShowCategoryScentsState

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      categoryname: '',
      categorynameToGraph: '',
      allCategories: []
    }
  }

  public async componentDidMount() {
    await getAll('category').then(response => {
      this.setState({ allCategories: response })
    })
  }

  isDisabled(): boolean {
    return this.state.categoryname === '' ||
      (this.state.allCategories && !(this.categoryNames(this.state.allCategories)).includes(this.state.categoryname))
  }

  categoryNames(items: ScentItem[]): string[] {
    return items.map(item => item.name)
  }

  onSubmit = async (event) => {
    event.preventDefault()
    try {
      if (this.state.categoryname !== '') {
        this.setState({
          categorynameToGraph: this.state.categoryname
        })
      }
    } catch (e) {
      this.setState({ message: `Could not show ScentGraph. ${e}` })
    }
  }

  public render(): JSX.Element {
    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Show all scents from a category</h2>
        <form onSubmit={this.onSubmit}>
          <p>Select Category:</p>
          {this.state.allCategories &&
            <Autocomplete
              value={this.state.categoryname}
              inputProps={{ id: 'category-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.state.allCategories}
              getItemValue={(item: ScentItem) => item.name}
              shouldItemRender={matchInput}
              onChange={(event, value) => this.setState({ categoryname: value })}
              onSelect={value => this.setState({ categoryname: value })}
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
            />}
          <div>
            <Button disabled={this.isDisabled()} variant="outline-info" type="submit">show</Button>
          </div>
        </form>
        {this.state.categorynameToGraph &&
          <ScentGraph
            containerId={'category-scents'}
            backgroundColor={'#e4e6e1'}
            categorynameToGraph={this.state.categorynameToGraph}
          />
        }
      </div>
    )
  }

}