import * as React from 'react'
import { createScent, getAll, createItem } from '../../services'
import { ScentToCreate, ScentItem, AdminContent } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'
import { matchInput } from '../../utils'

interface ScentCreateProps {
  history: any,
  location: any,
  match: any
}

interface ScentCreateState {
  scentname: string,
  brandname: string,
  seasonname?: string,
  gendername?: string,
  timename?: string,
  categoryname?: string,
  description?: string,
  url?: string,
  addedusername?: string,
  notenames?: string[],
  allBrands: ScentItem[],
  allNotes: ScentItem[],
  allCategories: ScentItem[]
}

export class ScentCreate extends React.PureComponent<ScentCreateProps, ScentCreateState> {
  constructor(props) {
    super(props)
    this.state = {
      scentname: '',
      brandname: '',
      seasonname: '',
      gendername: '',
      timename: '',
      categoryname: '',
      allBrands: [],
      allNotes: [],
      allCategories: []
    }
  }

  public async componentDidMount() {
    await getAll('category').then(response => {
      this.setState({ allCategories: response })
      console.log(response)
    })
    await getAll('brand').then(response => {
      this.setState({ allBrands: response })
      console.log(response)
    })
    await getAll('note').then(response => {
      this.setState({ allNotes: response })
      console.log(response)
    })
  }

  handleSeasonChange(event) {
    this.setState({ seasonname: event.target.value })
  }

  handleGenderChange(event) {
    this.setState({ gendername: event.target.value })
  }

  handleTimeChange(event) {
    this.setState({ timename: event.target.value })
  }

  isDisabled(): boolean {
    return this.state && (this.state.scentname === '' ||
      this.state.brandname === '') ||
      (this.state.allCategories && !(this.categoryNames(this.state.allCategories)).includes(this.state.categoryname))
  }

  categoryNames(items: ScentItem[]): string[] {
    return this.state.allCategories.map(item => item.name)
  }

  onSubmit = (event) => {
    event.preventDefault()

    const scentToCreate: ScentToCreate = {
      scentname: this.state.scentname,
      brandname: this.state.brandname,
      seasonname: this.state.seasonname,
      gendername: this.state.gendername,
      timename: this.state.timename,
      categoryname: this.state.categoryname
    }
    const adminContent: AdminContent = {
      itemName: this.state.brandname,
      type: 'brand'
    }
    createItem(adminContent)
      .then(response => {
        console.log(response)
        createScent(scentToCreate)
          .then(response => {
            console.log(`scent added: ${this.state.scentname}`)
            this.setState({
              scentname: '',
              brandname: '',
              seasonname: '',
              gendername: '',
              timename: '',
              categoryname: ''
            })
            this.props.history.push('/')
          })
      })
      .catch(success => {
        console.log(`something went wrong in scent creation..`)
      })
  }

  public render(): JSX.Element {
    return (
      <div className='container'>
        <h2>Add an item</h2>
        <form onSubmit={this.onSubmit}>
          <Form.Group>
            <Form.Label> Scent name </Form.Label>
            <Form.Control
              type="text"
              name="scentname"
              value={this.state.scentname}
              onChange={(event) => { this.setState({ scentname: event.target.value }) }}
              id='scentname' />
          </Form.Group>
          <Form.Group>
            <Form.Label> Brand name </Form.Label>
            <Form.Control
              type="text"
              name="brandname"
              value={this.state.brandname}
              onChange={(event) => { this.setState({ brandname: event.target.value }) }}
              id='brandname' />
          </Form.Group>

          <Form.Group controlId="scentForm.SeasonSelect">
            <Form.Label> Choose Season </Form.Label>
            <Form.Control
              name="season"
              as="select" multiple
              placeholder="select"
              onChange={(event) => { this.handleSeasonChange(event) }}>
              <option>Winter</option>
              <option>Spring</option>
              <option>Summer</option>
              <option>Autumn</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="scentForm.TimeSelect">
            <Form.Label> Choose Time of Day </Form.Label>
            <Form.Control
              name="timename"
              as="select" multiple
              placeholder="select"
              onChange={(event) => { this.handleTimeChange(event) }}>
              <option>Day</option>
              <option>Night</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="scentForm.genderSelect">
            <Form.Label> Choose Gender </Form.Label>
            <Form.Control
              name="gendername"
              as="select" multiple
              placeholder="select"
              onChange={(event) => { this.handleGenderChange(event) }}>
              <option>Female</option>
              <option>Male</option>
              <option>Unisex</option>
            </Form.Control>
          </Form.Group>
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
            <Button disabled={this.isDisabled()} variant="outline-info" type="submit">save</Button>
          </div>
        </form>
      </div >
    )
  }
}
