import * as React from 'react'
import { ScentToCreate, ScentItem, AdminContent } from '../../../common/data-classes'
import { getAll, createItem } from '../../services'
import Notification from '../../components/notification'
import Autocomplete from 'react-autocomplete'
import { matchInput } from '../../utils'

interface NoteCreateProps {

}

interface NoteCreateState {
  message: string,
  allScents: ScentItem[],
  allNotes: ScentItem[],
  newNotes: string[],
  scentname: string,
  scentNotes: string[]
}




export class NoteCreate extends React.PureComponent<NoteCreateProps, NoteCreateState> {

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      scentname: '',
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


  public render(): JSX.Element {
    return (
      <div className='container'>
      <Notification message={this.state.message} />
      <h2>Add Notes to a Scent</h2>
      <p>Select Scent:</p>
      {this.state.allScents &&
            <Autocomplete
              value={this.state.scentname}
              inputProps={{ id: 'scent-autocomplete' }}
              wrapperStyle={{ position: 'relative', display: 'inline-block' }}
              items={this.state.allScents}
              getItemValue={(item: ScentItem) => item.name}
              shouldItemRender={matchInput}
              onChange={(event, value) => this.setState({ scentname: value })}
              onSelect={value => this.setState({ scentname: value })}
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
      </div>
    )
  }
}

