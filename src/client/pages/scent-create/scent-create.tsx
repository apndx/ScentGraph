import * as React from 'react'
import { createScent, getAll, createItem } from '../../services'
import { ScentToCreate, ScentItem, AdminContent } from '../../../common/data-classes'
import { Form, Button } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'
import { matchInput } from '../../utils'
import { Notification } from '../../components'
import { getItemNames, sortByName } from './scent-create-util'

interface Props {
  history: any,
  location: any,
  match: any
}

const ScentCreate: React.FC<Props> = ({
  history
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
  const [allCategories, setAllCategories] = React.useState([])
  const [timer, setTimer] = React.useState<NodeJS.Timeout|undefined>(undefined)


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

    // call the functions
    fetchCategoryData()
    fetchBrandData()

      .catch(console.error)

      return function cleanup() {
        setTimer(undefined)
      };

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

    const timer = setTimeout(() => {
      setMessage('')
    }, 20000)

    setTimer(timer)
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
    allCategories && !getItemNames(allCategories).includes(categoryname)

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

    if (!getItemNames(allBrands).includes(brandname)) {
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
      <h2 className='label'>Add a Scent</h2>
      <form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label className='label'> Scent name </Form.Label>
          <Form.Control
            type='text'
            name='scentname'
            value={scentname}
            onChange={event => { setScentname(event.target.value) }}
            id='scentname' />
          <Form.Label className='label'> Fragrantica URL (optional) </Form.Label>
          <Form.Control
            type='text'
            name='url'
            value={url}
            onChange={event => { setUrl(event.target.value) }}
            id='url' />
        </Form.Group>
        <Form.Group controlId='scentForm.SeasonSelect'>
          <Form.Label className='options-label'> Choose season </Form.Label>
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
          <Form.Label className='options-label'> Choose time of day </Form.Label>
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
          <Form.Label className='options-label'> Choose gender </Form.Label>
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

        <p className='label'>Select category</p>
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

        <p className='label'>Select or add brand</p>
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
      <style jsx>{`
        .label {
          margin-top: 12px;
          margin-bottom: 4px;
        }

        .options-label {
          margin-bottom: 4px;
        }

        .container {
          margin-left: 60px;
        }

      `}</style>
    </div >
  )
}

export default ScentCreate
