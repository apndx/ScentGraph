import * as React from 'react'
import { ScentToCreate, ScentItem, AdminContent } from '../../../common/data-classes'
import { getAll, getScentNotes, createItem } from '../../services'
import Notification from '../../components/notification'
import Autocomplete from 'react-autocomplete'
import { matchScentInput, matchInput } from '../../utils'
import { Form, Button } from 'react-bootstrap'


interface NoteCreateProps {

}

interface NoteCreateState {
  message: string,
  allScents: ScentItem[],
  allNotes: ScentItem[],
  newNotes: string[],
  scent: string,
  note: string,
  scentNotes: ScentItem[]
}


export class NoteCreate extends React.PureComponent<NoteCreateProps, NoteCreateState> {
  private timer
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      scent: '',
      allScents: [],
      allNotes: [],
      newNotes: [],
      scentNotes: [],
      note: ''
    }
    this.timer = null
  }


  public async componentDidMount() {
    await getAll('scents').then(response => {
      this.setState({ allScents: response })
    })
    await getAll('note').then(response => {
      this.setState({ allNotes: response })
    })
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const scentArray = this.state.scent.split(' - ')
    const scentItem: ScentItem = { name: scentArray[0], brand: scentArray[1] }
    await getScentNotes(scentItem).then(response => {
      this.setState({ scentNotes: response })
      console.log(this.state.scentNotes)
    })

  }

  onNoteAdd = async (event) => {
    event.preventDefault()
    console.log('NOTE', this.state.note)

    if (!this.noteNames(this.state.allNotes).includes(this.state.note)) {
      const newNote: AdminContent = {
        itemName: this.state.note,
        type: 'note'
      }
      //   createItem(newNote)
      //     .then(response => {
      //       this.setMessage(response)
      //       createScent(scentToCreate)
      //         .then(response => {
      //           this.afterScentCreation()
      //         })
      //     })
      //     .catch(message => {
      //       this.setMessage(`Something went wrong in scent creation: ${message}`)
      //     })
      // } else {
      //   createScent(scentToCreate)
      //     .then(response => {
      //       this.afterScentCreation()
      //     })
      //     .catch(message => {
      //       this.setMessage(`Something went wrong in scent creation: ${message}`)
      //     })
    }
  }

  private setMessage(message) {
    this.setState({ message: message })
    this.timer = setTimeout(() => {
      this.setState({ message: '' })
    }, 20000)
  }

  noteNames(items: ScentItem[]): string[] {
    return items.map(item => item.name)
  }

  scentNamesBrands(items: ScentItem[]): string[] {
    return items.map(item => `${item.name} - ${item.brand}`)
  }

  isDisabled(): boolean {
    return this.state && (this.state.scent === '' ||
      (this.state.allScents && !(this.scentNamesBrands(this.state.allScents)).includes(this.state.scent)))
  }

  public render(): JSX.Element {
    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Add Notes to a Scent</h2>
        <p>Select Scent:</p>
        <form onSubmit={this.onSubmit}>
          {this.state.allScents &&
            <Autocomplete
              value={this.state.scent}
              inputProps={{ id: 'scent-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.state.allScents}
              getItemValue={(item: ScentItem) => `${item.name} - ${item.brand}`}
              shouldItemRender={matchScentInput}
              onChange={(event, value) => this.setState({ scent: value })}
              onSelect={value => this.setState({ scent: value })}
              renderMenu={children => (
                <div className="menu">
                  {children}
                </div>
              )}
              renderItem={(item, isHighlighted) => (
                <div
                  className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                  key={item.id}
                >{item.name} - {item.brand}</div>
              )}
            />}
          <p></p>
          <div>
            <Button disabled={this.isDisabled()} variant="outline-info" type="submit">Get existing notes for scent</Button>
          </div>
        </form>
        <p></p>
        <p>Select Note to Add:</p>
        <form onSubmit={this.onNoteAdd}>
          {this.state.allNotes &&
            <Autocomplete
              value={this.state.note}
              inputProps={{ id: 'note-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.state.allNotes}
              getItemValue={(item: ScentItem) => item.name}
              shouldItemRender={matchInput}
              onChange={(event, value) => this.setState({ note: value })}
              onSelect={value => this.setState({ note: value })}
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
          <p></p>
          <div>
            <Button variant="outline-info" type="submit">Add note for scent</Button>
          </div>
        </form>

        {this.state.scent &&
          <div>
            <h3>Notes:</h3>
            {this.state.scentNotes && this.state.scentNotes.length > 0 ?
              this.state.scentNotes.map(note => { <p>{note}ploo</p> })
              : <p>no notes yet</p>
            }
          </div>
        }
      </div>
    )
  }
}

