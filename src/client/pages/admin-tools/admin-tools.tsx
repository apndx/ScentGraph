import * as React from 'react'
import { DEFAULT_PROPS, SessionStorageItem } from '../../utils'
import { createItem } from '../../services'
import { AdminContent, ClientUser } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'

interface AdminToolsProps {
  history: any,
  location: any,
  match: any,
  loginUser: ClientUser
}

interface AdminToolsState {
  loginUser: ClientUser
  itemName: string,
  label: string,
  type: string
}

export class AdminTools extends React.PureComponent<AdminToolsProps, AdminToolsState> {
  constructor(props) {
    super(props)
    this.state = {
      loginUser: null,
      itemName: '',
      label: '',
      type: ''
    }
  }

  componentDidMount() {
    const loggedUserJSON = window.sessionStorage.getItem(SessionStorageItem.LoginUser)
    console.log('LOG', loggedUserJSON)
    if (loggedUserJSON) {
      const loginUser = JSON.parse(loggedUserJSON)
      this.setState({loginUser})
    }  
  } 

  handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    console.log(name, value)
    this.setState({ type: value })
    console.log(this.state)
  }


  isDisabled(): boolean {
    return this.state && (this.state.itemName.length < 3 || this.state.type === '')
  }

  onSubmit = (event) => {

    event.preventDefault()

    console.log('EVENT', event)

    // const adminContent: AdminContent = {
    //   itemName: this.state.itemName,
    //   label: this.state.label,
    //   type: this.state.type
    // }

    // createItem(adminContent)
    //   .then(response => {
    //     console.log(`admin item added: ' ${response.body} ' `)
    //     this.setState({
    //       itemName: '', label: '', type: ''
    //     })
    //     this.props.history.push('/')
    //   })
    //   .catch(success => {
    //     console.log(`something went wrong on admin item creation..`)
    //   })

  }



  public render(): JSX.Element {
    return (
      <div className='container'>
        <h2>Add an item</h2>
        <form onSubmit={this.onSubmit}>
          <Form.Group controlId="adminForm.TypeSelect">
            <Form.Label> Choose Item type </Form.Label>
            <Form.Control
              name="type"
              as="select" multiple
              placeholder="select"
              onChange={(event) => { this.handleChange(event) }}>
              <option>Season</option>
              <option>Time of Day</option>
              <option>Gender</option>
              <option>Category</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label> Item name </Form.Label>
            <Form.Control
              type="text"
              name="itemName"
              value={this.state.itemName}
              onChange={(event) => { this.setState({ itemName: event.target.value }) }}
              id='itemName' />
          </Form.Group>
          {this.state.type === 'Category' &&
            <Form.Group>
              <Form.Label> Label </Form.Label>
              <Form.Control
                type="text"
                name="label"
                value={this.state.label}
                onChange={(event) => { this.setState({ label: event.target.value }) }}
                id='label' />
            </Form.Group>}
          <Button disabled={this.isDisabled()} variant="outline-info" type="submit">save</Button>
        </form>
      </div >
    )
  }
}