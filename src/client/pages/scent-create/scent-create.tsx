import * as React from 'react'
import { createScent, getAll, createItem } from '../../services'
import { ScentToCreate, ScentItem, AdminContent } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'
import { matchInput, sortNames } from '../../utils'
import { Notification } from '../../components'

interface Props {
  history: any,
  location: any,
  match: any
}

const ScentCreate: React.FC<Props> = ({
  history, location, match
}) => {

  const [message, setMessage] = React.useState('')
  const [scentname, setScentname] = React.useState('')
  const [brandname, setBrandname] = React.useState('')
  const [seasonname, setSeasonname] = React.useState('')
  const [gendername, setGendername] = React.useState('')
  const [timename, setTimename] = React.useState('')
  const [categoryname, setCategoryname] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [allBrands, setAllBrands] = React.useState([])
  const [allNotes, setAllNotes] =React.useState([])
  const [allCategories, setAllCategories] = React.useState([])


  React.useEffect(() => {

    const fetchCategoryData = async () => {
      const categories = await getAll('category').then(categories => {
        const allCategories = sortByName(categories)
        setAllCategories(allCategories)
      })
    }

    const fetchBrandData = async () => {
      const brands = await getAll('brand').then(brands => {
        const allBrands = sortByName(brands)
        setAllBrands(allBrands)
      })
    }
    const fetchNoteData = async () => {
      const notes = await getAll('note').then(notes => {
        const allNotes = sortByName(notes)
        setAllNotes(allNotes)
      })
    }
    // call the function
    fetchCategoryData()
    fetchBrandData()
    fetchNoteData()
      // make sure to catch any error
      .catch(console.error);;

  }, [])


  const handleSeasonChange = async (event) => {
    setSeasonname(event.target.value)
  }

  const handleGenderChange = async (event) => {
    setGendername(event.target.value)
  }

  const handleTimeChange = async (event) => {
    setTimename(event.target.value)
  }

  const handleMessage = async (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage('')
    }, 20000)
  }

  const afterScentCreation = () => {

    setScentname('')
    setBrandname('')
    setSeasonname('')
    setGendername('')
    setTimename('')
    setCategoryname('')
    setUrl('')

    history.push({
      pathname: '/',
      message: `Scent added: ${scentname}`
    })
  }

  const isDisabled =
    scentname === '' || brandname === '' ||
    allCategories && !categoryNames(allCategories).includes(categoryname)

  const onSubmit = async event => {
    event.preventDefault()

    const scentToCreate: ScentToCreate = {
      scentname,
      brandname,
      seasonname,
      gendername,
      timename,
      categoryname,
      url
    }

    if (!brandNames(allBrands).includes(brandname)) {
      const newBrand: AdminContent = {
        itemName: brandname,
        type: 'brand'
      }
      createItem(newBrand)
        .then(response => {
          handleMessage(response)
          createScent(scentToCreate)
            .then(response => {
              afterScentCreation()
            })
        })
        .catch(message => {
          handleMessage(`Something went wrong in scent creation: ${message}`)
        })
    } else {
      createScent(scentToCreate)
        .then(response => {
          afterScentCreation()
        })
        .catch(message => {
          handleMessage(`Something went wrong in scent creation: ${message}`)
        })
    }
  }

  return (
    <div className='container'>
      <Notification message={message} />
      <h2>Add a Scent</h2>
      <form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label> Scent name </Form.Label>
          <Form.Control
            type='text'
            name='scentname'
            value={scentname}
            onChange={event => { setScentname(event.target.value) }}
            id='scentname' />
          <Form.Label> Fragrantica URL (optional) </Form.Label>
          <Form.Control
            type='text'
            name='url'
            value={url}
            onChange={event => { setUrl(event.target.value) }}
            id='url' />
        </Form.Group>
        <Form.Group controlId='scentForm.SeasonSelect'>
          <Form.Label> Choose season </Form.Label>
          <Form.Control
            name='season'
            as='select' multiple
            placeholder='select'
            onChange={event => { handleSeasonChange(event) }}>
            <option>Winter</option>
            <option>Spring</option>
            <option>Summer</option>
            <option>Autumn</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='scentForm.TimeSelect'>
          <Form.Label> Choose time of day </Form.Label>
          <Form.Control
            name='timename'
            as='select' multiple
            placeholder='select'
            onChange={event => { handleTimeChange(event) }}>
            <option>Day</option>
            <option>Night</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='scentForm.genderSelect'>
          <Form.Label> Choose gender </Form.Label>
          <Form.Control
            name='gendername'
            as='select' multiple
            placeholder='select'
            onChange={event => { handleGenderChange(event) }}>
            <option>Female</option>
            <option>Male</option>
            <option>Unisex</option>
          </Form.Control>
        </Form.Group>

        <p>Select category</p>
        {allCategories &&
          <Autocomplete
            value={categoryname}
            inputProps={{ id: 'category-autocomplete' }}
            wrapperStyle={{ position: 'relative', display: 'inline-block' }}
            items={allCategories}
            getItemValue={(item: ScentItem) => item.name}
            shouldItemRender={matchInput}
            onChange={(event, value) => setCategoryname(value)}
            onSelect={value => setCategoryname(value)}
            renderMenu={children => (
              <div className='menu'>
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

        <p>Select or add brand</p>
        {allBrands &&
          <Autocomplete
            value={brandname}
            inputProps={{ id: 'brand-autocomplete' }}
            wrapperStyle={{ position: 'relative', display: 'inline-block' }}
            items={allBrands}
            getItemValue={(item: ScentItem) => item.name}
            shouldItemRender={matchInput}
            onChange={(event, value) => setBrandname(value)}
            onSelect={value => setBrandname(value)}
            renderMenu={children => (
              <div className='menu'>
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
          <Button disabled={isDisabled} variant='outline-info' type='submit'>save</Button>
        </div>
      </form>
    </div >
  )
}

export default ScentCreate

function sortByName(response: any) {
  return response.sort((a, b) => { return sortNames(a.name, b.name) })
}

function categoryNames(items: ScentItem[]): string[] {
  return items.map(item => item.name)
}

function brandNames(items: ScentItem[]): string[] {
  return items.map(item => item.name)
}
