import * as React from 'react'
import { ScentToCreate, ScentItem, AdminContent } from '../../../common/data-classes'
import { getAll, getScentNotes } from '../../services'
import Notification from '../../components/notification'
import Autocomplete from 'react-autocomplete'
import { matchScentInput } from '../../utils'

interface NoteCreateProps {

}

interface NoteCreateState {
  message: string,
  allScents: ScentItem[],
  allNotes: ScentItem[],
  newNotes: string[],
  scent: string,
  scentNotes: string[]
}




export class NoteCreate extends React.PureComponent<NoteCreateProps, NoteCreateState> {

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      scent: '',
      allScents: [],
      allNotes: [],
      newNotes: [],
      scentNotes: []
    }
  }


  public async componentDidMount() {
    await getAll('scents').then(response => {
      this.setState({ allScents: response })
    })
    await getAll('note').then(response => {
      this.setState({ allNotes: response })
    })
  }

  public async getNotesForScent() {

    if (this.state.scent !== '') {
      const scentArray = this.state.scent.split(' - ')
      const scentItem: ScentItem = {name: scentArray[0], brand: scentArray[1]}
      await getScentNotes(scentItem).then(response => {
        this.setState({ scentNotes: response })
      })

    }
   
  }


  public render(): JSX.Element {
    return (
      <div className='container'>
        <Notification message={this.state.message} />
        <h2>Add Notes to a Scent</h2>
        <p>Select Scent:</p>
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
      </div>
    )
  }
}

