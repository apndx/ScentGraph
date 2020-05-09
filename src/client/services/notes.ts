import axios from 'axios'
import { SessionStorageItem, errorHandler } from '../utils'
import { ScentItem } from '../../common/data-classes'

const baseUrl = '/api/'

export const getScentNotes = async (item: ScentItem) => {
  const path = `${baseUrl}note`
    const config = {
      headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
    }
    try {
      const response = await axios.post(`${path}/allForScent`, item, config)
      return response.data
    } catch (error) {
      errorHandler(error)
    }
  }
