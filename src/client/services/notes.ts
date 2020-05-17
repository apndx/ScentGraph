import axios from 'axios'
import { SessionStorageItem, errorHandler } from '../utils'
import { ScentItem } from '../../common/data-classes'

const baseUrl = '/api/note'

export const getScentNotes = async (item: ScentItem) => {
  const path = `${baseUrl}/allForScent`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  try {
    const response = await axios.post(path, item, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}

export const attachNoteToScent = async (item: ScentItem) => {
  const path = `${baseUrl}/addToScent`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  try {
    const response = await axios.post(path, item, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}
