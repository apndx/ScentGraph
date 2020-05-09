import * as React from 'react'
import { SessionStorageItem } from '../../utils'
import { createItem } from '../../services'
import { AdminContent } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'
import { Notification} from '../../components'

interface AdminToolsProps {
  history: any,
  location: any,
  match: any
}

interface AdminToolsState {
  message: string,
  itemName: string,
  label: string,
  type: string
}

export class AdminTools extends React.PureComponent<AdminToolsProps, AdminToolsState> {
  private timer
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      itemName: '',
      label: '',
      type: ''
    }
    this.timer = null
  }

  handleChange(event) {
    this.setState({ type: event.target.value.toLowerCase() })
  }

  isDisabled(): boolean {
    return this.state && (this.state.itemName.length < 3 || this.state.type === '')
  }

  isAdmin(): boolean {
    return window.sessionStorage.getItem(SessionStorageItem.LoginRole) === 'admin'
  }

  onSubmit = (event) => {
    event.preventDefault()
    const adminContent: AdminContent = {
      itemName: this.state.itemName,
      ...(this.state.label && { label: this.state.label }),
      type: this.state.type
    }

    createItem(adminContent)
      .then(response => {
        this.setState({
          itemName: '', label: '', type: ''
        })
        this.props.history.push({
          pathname: '/',
          message: `Admin item added: ${response}`
        })
      })
      .catch(message => {
        this.setMessage(`${message}`)
      })
  }

  private setMessage(message) {
    this.setState({ message: message })
    this.timer = setTimeout(() => {
      this.setState({ message: '' })
    }, 20000)
  }

  public componentWillUnmount() {
    clearTimeout(this.timer)
  }


  public render(): JSX.Element {
    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Add an item for scent creation</h2>
        <form onSubmit={this.onSubmit}>
          <Form.Group controlId="adminForm.TypeSelect">
            <Form.Label> Choose Item type </Form.Label>
            <Form.Control
              name="type"
              as="select" multiple
              placeholder="select"
              onChange={(event) => { this.handleChange(event) }}>
              <option>Season</option>
              <option>Time</option>
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
          {this.state.type === 'category' &&
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
