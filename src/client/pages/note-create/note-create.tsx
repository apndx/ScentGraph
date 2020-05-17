import * as React from 'react'
import { ScentItem, AdminContent } from '../../../common/data-classes'
import { getAll, getScentNotes, createItem, attachNoteToScent } from '../../services'
import { Notification, Note } from '../../components'
import Autocomplete from 'react-autocomplete'
import { matchScentInput, matchInput, sortNames, scentNamesBrands } from '../../utils'
import { Button } from 'react-bootstrap'

interface NoteCreateProps {
}

interface NoteCreateState {
  message: string,
  scent: string,
  note: string,
  allScents: ScentItem[],
  allNotes: ScentItem[],
  scentNotes: ScentItem[],
  notesFetched: boolean

}

export class NoteCreate extends React.PureComponent<NoteCreateProps, NoteCreateState> {
  private timer
  private _isMounted
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      scent: '',
      note: '',
      allScents: [],
      allNotes: [],
      scentNotes: [],
      notesFetched: false
    }
    this.timer = null
    this._isMounted = false
  }

  public async componentDidMount() {
    this._isMounted = true
    await getAll('scents').then(response => {
      this.setState({ allScents: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
    await getAll('note').then(response => {
      this.setState({ allNotes: response.sort((a, b) => { return sortNames(a.name, b.name) }) })
    })
  }

  public componentWillUnmount() {
    this._isMounted = false
    clearTimeout(this.timer)
  }

  onScentWasChosen = async (event) => {
    event.preventDefault()
    const scentArray = this.state.scent.split(' - ')
    const scentItem: ScentItem = { name: scentArray[0], brand: scentArray[1] }
    await getScentNotes(scentItem).then(response => {
      this.setState({ scentNotes: response.sort((a, b) => { return sortNames(a.name, b.name) }), notesFetched: true })
    })
  }

  onNoteAdd = async (event) => {
    event.preventDefault()
    const scentArray = this.state.scent.split(' - ')
    const scentItem: ScentItem = {
      name: scentArray[0],
      brand: scentArray[1],
      note: this.state.note
    }

    if (!this.noteNames(this.state.allNotes).includes(this.state.note)) {
      const newNote: AdminContent = {
        itemName: this.state.note,
        type: 'note'
      }
      createItem(newNote)
        .then(response => {
          this.setMessage(response)
          attachNoteToScent(scentItem)
            .then(response => {
              this.setMessage(response)
            })
            .then(() => {
              getScentNotes(scentItem).then(response => {
                this.setState({
                  scentNotes: response.sort((a, b) => { return sortNames(a.name, b.name) }), note: ''
                })
              })
            })
        })
        .catch(message => {
          this.setMessage(`Something went wrong: ${message}`)
        })
    } else {
      attachNoteToScent(scentItem)
        .then(response => {
          this.setMessage(response)
        })
        .then(() => {
          getScentNotes(scentItem).then(response => {
            this.setState({ scentNotes: response.sort((a, b) => { return sortNames(a.name, b.name) }), note: '' })
          })
        })
        .catch(message => {
          this.setMessage(`Something went wrong: ${message}`)
        })
    }
  }

  private setMessage(message) {
    this.setState({ message })
    this.timer = setTimeout(() => {
      this._isMounted && this.setState({ message: '' })
    }, 20000)
  }

  noteNames(items: ScentItem[]): string[] {
    return items.map(item => item.name)
  }

  isDisabled(): boolean {
    return this.state && (this.state.scent === '' ||
      (this.state.allScents && !(scentNamesBrands(this.state.allScents)).includes(this.state.scent)))
  }

  public render(): JSX.Element {
    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Attach a Note to a Scent</h2>
        <p>Select a Scent:</p>
        <form onSubmit={this.onScentWasChosen}>
          {this.state.allScents &&
            <Autocomplete
              value={this.state.scent}
              inputProps={{ id: 'scent-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.state.allScents}
              getItemValue={(item: ScentItem) => `${item.name} - ${item.brand}`}
              shouldItemRender={matchScentInput}
              onChange={(event, value) => this.setState({ scent: value })}
              onSelect={value => this.setState({ scent: value, notesFetched: false })}
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
        <p>Select or add a Note:</p>
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
            <Button variant="outline-info" type="submit">Attach</Button>
          </div>
        </form>

        {this.state.notesFetched &&
          <div>
            <p></p>
            <h3>Notes:</h3>
            {this.state.scentNotes && this.state.scentNotes.length > 0 ?
              this.state.scentNotes
                .map(note => <Note key={note.id} note={note} />)
              : <p>no notes yet</p>
            }
          </div>
        }
      </div>
    )
  }
}
